import type { Tx } from "@ctrlplane/db";
import type { JobConfig } from "@ctrlplane/db/schema";

import { and, eq, isNull, notInArray } from "@ctrlplane/db";
import { jobConfig, jobExecution } from "@ctrlplane/db/schema";

import { createJobExecutions } from "./job-execution.js";

export const getCancelJobExecutionsForReleaseFunction =
  (releaseId: string, environmentId: string) =>
  (tx: Tx, jobConfigs: JobConfig[]) =>
    tx
      .select()
      .from(jobConfig)
      .leftJoin(jobExecution, eq(jobExecution.jobConfigId, jobConfig.id))
      .where(
        and(
          eq(jobConfig.releaseId, releaseId),
          eq(jobConfig.environmentId, environmentId),
          isNull(jobExecution.id),
          notInArray(
            jobConfig.id,
            jobConfigs.map((j) => j.id),
          ),
        ),
      )
      .then(
        (existingJobConfigs) =>
          void createJobExecutions(
            tx,
            existingJobConfigs.map((j) => j.job_config),
            "cancelled",
          ),
      );
