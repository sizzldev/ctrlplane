import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { and, eq, isNull, takeFirst, takeFirstOrNull } from "@ctrlplane/db";
import { db } from "@ctrlplane/db/client";
import {
  deployment,
  environment,
  job,
  jobVariable,
  release,
  releaseJobTrigger,
  runbook,
  runbookJobTrigger,
  target,
  targetMetadata,
  updateJob,
} from "@ctrlplane/db/schema";
import { onJobCompletion } from "@ctrlplane/job-dispatch";
import { JobStatus } from "@ctrlplane/validators/jobs";

import { getUser } from "~/app/api/v1/auth";

export const GET = async (
  req: NextRequest,
  { params }: { params: { jobId: string } },
) => {
  const user = await getUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const je = await db
    .select()
    .from(job)
    .leftJoin(runbookJobTrigger, eq(runbookJobTrigger.jobId, job.id))
    .leftJoin(runbook, eq(runbookJobTrigger.runbookId, runbook.id))
    .leftJoin(releaseJobTrigger, eq(releaseJobTrigger.jobId, job.id))
    .leftJoin(environment, eq(environment.id, releaseJobTrigger.environmentId))
    .leftJoin(target, eq(target.id, releaseJobTrigger.targetId))
    .leftJoin(release, eq(release.id, releaseJobTrigger.releaseId))
    .leftJoin(deployment, eq(deployment.id, release.deploymentId))
    .where(and(eq(job.id, params.jobId), isNull(environment.deletedAt)))
    .then(takeFirst)
    .then((row) => ({
      job: row.job,
      runbook: row.runbook,
      environment: row.environment,
      target: row.target,
      deployment: row.deployment,
      release: row.release,
    }));

  const jobVariableRows = await db
    .select()
    .from(jobVariable)
    .where(eq(jobVariable.jobId, params.jobId));

  const variables = Object.fromEntries(
    jobVariableRows.map((v) => [v.key, v.value]),
  );

  const jobTargetMetadataRows = await db
    .select()
    .from(targetMetadata)
    .where(eq(targetMetadata.targetId, je.target?.id ?? ""));

  const metadata = Object.fromEntries(
    jobTargetMetadataRows.map((m) => [m.key, m.value]),
  );

  const targetWithMetadata = {
    ...je.target,
    metadata,
  };

  return NextResponse.json({
    ...je.job,
    ...je,
    variables,
    target: targetWithMetadata,
  });
};

const bodySchema = updateJob;

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { jobId: string } },
) => {
  const response = await req.json();
  const body = bodySchema.parse(response);

  const je = await db
    .update(job)
    .set(body)
    .where(and(eq(job.id, params.jobId)))
    .returning()
    .then(takeFirstOrNull);

  if (je == null)
    return NextResponse.json(
      { error: "Job execution not found" },
      { status: 404 },
    );

  if (je.status === JobStatus.Completed)
    onJobCompletion(je).catch(console.error);

  return NextResponse.json(je);
};
