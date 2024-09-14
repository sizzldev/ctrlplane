import type { Tx } from "@ctrlplane/db";
import type { Job, ReleaseJobTrigger } from "@ctrlplane/db/schema";
import _ from "lodash";

import { and, eq, inArray, isNull, or, takeFirst } from "@ctrlplane/db";
import { db } from "@ctrlplane/db/client";
import {
  deployment,
  environment,
  environmentPolicy,
  environmentPolicyDeployment,
  job,
  jobAgent,
  release,
  releaseJobTrigger,
  runbook,
} from "@ctrlplane/db/schema";

import { dispatchJobConfigs } from "./job-dispatch.js";
import { isPassingAllPolicies } from "./policy-checker.js";
import { cancelOldJobConfigsOnJobDispatch } from "./release-sequencing.js";

type JobExecutionStatusType =
  | "completed"
  | "cancelled"
  | "skipped"
  | "in_progress"
  | "action_required"
  | "pending"
  | "failure"
  | "invalid_job_agent";

export type JobExecutionReason =
  | "policy_passing"
  | "policy_override"
  | "env_policy_override"
  | "config_policy_override";

/**
 * Converts a job config into a job execution which means they can now be
 * picked up by job agents
 */
export const createJobExecutions = async (
  db: Tx,
  jobConfigs: ReleaseJobTrigger[],
  status: JobExecutionStatusType = "pending",
  reason?: JobExecutionReason,
): Promise<Job[]> => {
  const insertJobExecutions = await db
    .select()
    .from(releaseJobTrigger)
    .leftJoin(release, eq(release.id, releaseJobTrigger.releaseId))
    .leftJoin(deployment, eq(deployment.id, release.deploymentId))
    .innerJoin(
      jobAgent,
      or(
        eq(jobAgent.id, deployment.jobAgentId),
        eq(jobAgent.id, runbook.jobAgentId),
      ),
    )
    .where(
      inArray(
        releaseJobTrigger.id,
        jobConfigs.map((t) => t.id),
      ),
    )
    .then((ds) =>
      ds.map((d) => ({
        jobConfigId: d.release_job_trigger.id,
        jobAgentId: d.job_agent.id,
        jobAgentConfig: _.merge(
          d.job_agent.config,
          d.deployment?.jobAgentConfig ?? {},
        ),
        status,
        reason,
      })),
    );

  if (insertJobExecutions.length === 0) return [];

  return db.insert(job).values(insertJobExecutions).returning();
};

export const onJobExecutionStatusChange = async (je: Job) => {
  if (je.status === "completed") {
    const config = await db
      .select()
      .from(releaseJobTrigger)
      .innerJoin(release, eq(releaseJobTrigger.releaseId, release.id))
      .innerJoin(
        environment,
        eq(releaseJobTrigger.environmentId, environment.id),
      )
      .where(eq(releaseJobTrigger.jobId, je.id))
      .then(takeFirst);

    const affectedJobConfigs = await db
      .select()
      .from(releaseJobTrigger)
      .leftJoin(job, eq(job.id, releaseJobTrigger.jobId))
      .innerJoin(release, eq(releaseJobTrigger.releaseId, release.id))
      .innerJoin(
        environment,
        eq(releaseJobTrigger.environmentId, environment.id),
      )
      .innerJoin(
        environmentPolicy,
        eq(environment.policyId, environmentPolicy.id),
      )
      .innerJoin(
        environmentPolicyDeployment,
        eq(environmentPolicyDeployment.policyId, environmentPolicy.id),
      )
      .where(
        and(
          isNull(releaseJobTrigger.jobId),
          isNull(environment.deletedAt),
          or(
            and(
              eq(releaseJobTrigger.releaseId, config.release.id),
              eq(
                environmentPolicyDeployment.environmentId,
                config.environment.id,
              ),
            ),
            and(
              eq(environmentPolicy.releaseSequencing, "wait"),
              eq(environment.id, config.environment.id),
            ),
          ),
        ),
      );

    await dispatchJobConfigs(db)
      .jobConfigs(affectedJobConfigs.map((t) => t.release_job_trigger))
      .filter(isPassingAllPolicies)
      .then(cancelOldJobConfigsOnJobDispatch)
      .dispatch();
  }
};
