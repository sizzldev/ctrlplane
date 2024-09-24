import type * as schema from "@ctrlplane/db/schema";

export type VariableData = schema.DeploymentVariable & {
  values: (schema.DeploymentVariableValue & {
    deploymentVariableValueTargetFilters: (schema.DeploymentVariableValueTargetFilter & {
      targets: schema.Target[];
    })[];
  })[];
};
