import type * as schema from "@ctrlplane/db/schema";
import type { ComparisonCondition } from "@ctrlplane/validators/targets";

export type VariableValue = schema.DeploymentVariableValue & {
  targetFilter: ComparisonCondition | null;
  targets: schema.Target[];
};

export type VariableData = schema.DeploymentVariable & {
  values: VariableValue[];
};
