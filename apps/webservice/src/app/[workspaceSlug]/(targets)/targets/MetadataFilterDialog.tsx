import type {
  ComparisonCondition,
  MetadataCondition,
} from "@ctrlplane/validators/targets";
import { useState } from "react";
import _ from "lodash";

import { Button } from "@ctrlplane/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@ctrlplane/ui/dialog";
import { useForm } from "@ctrlplane/ui/form";
import {
  TargetFilterType,
  TargetOperator,
} from "@ctrlplane/validators/targets";

import type { MetadataFilterForm } from "../../_components/filter/TargetMetadataFilterForm";
import type { TargetFilter } from "./TargetFilter";
import {
  metadataFilterForm,
  TargetMetadataFilterForm,
} from "../../_components/filter/TargetMetadataFilterForm";

export const MetadataFilterDialog: React.FC<{
  children: React.ReactNode;
  workspaceId: string;
  onChange?: (filter: TargetFilter) => void;
  filter?: ComparisonCondition;
}> = ({ children, workspaceId, onChange, filter }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    schema: metadataFilterForm,
    defaultValues: {
      operator:
        filter?.operator === TargetOperator.Or
          ? TargetOperator.Or
          : TargetOperator.And,
      targetFilter: (filter?.conditions as MetadataCondition[] | undefined) ?? [
        {
          key: "",
          value: "",
          operator: TargetOperator.Equals,
          type: TargetFilterType.Metadata,
        },
      ],
    },
  });

  const onSubmit = (values: MetadataFilterForm) => {
    const cond = {
      type: TargetFilterType.Comparison as const,
      operator: values.operator,
      conditions: values.targetFilter,
    };
    onChange?.({ key: "metadata", value: cond });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Filter by metadata</DialogTitle>
        <TargetMetadataFilterForm
          form={form}
          workspaceId={workspaceId}
          onSubmit={onSubmit}
        >
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                form.watch().targetFilter.some((f) => f.key === "")
              }
            >
              Filter
            </Button>
          </DialogFooter>
        </TargetMetadataFilterForm>
      </DialogContent>
    </Dialog>
  );
};
