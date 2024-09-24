import type {
  ComparisonCondition,
  NameCondition,
} from "@ctrlplane/validators/targets";
import { useState } from "react";

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

import type { TargetNameFilterFormValues } from "../../_components/filter/TargetNameFilterForm";
import type { TargetFilter } from "./TargetFilter";
import {
  targetNameFilterForm,
  TargetNameFilterForm,
} from "../../_components/filter/TargetNameFilterForm";

export const NameFilterDialog: React.FC<{
  children: React.ReactNode;
  onChange?: (filter: TargetFilter) => void;
  filter?: ComparisonCondition;
}> = ({ children, onChange, filter }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    schema: targetNameFilterForm,
    defaultValues: {
      operator:
        filter?.operator === TargetOperator.Or
          ? TargetOperator.Or
          : TargetOperator.And,
      targetFilter: (filter?.conditions as NameCondition[] | undefined) ?? [
        {
          value: "",
          operator: TargetOperator.Like,
          type: TargetFilterType.Name,
        },
      ],
    },
  });

  const onSubmit = (values: TargetNameFilterFormValues) => {
    const cond = {
      type: TargetFilterType.Comparison as const,
      operator: values.operator,
      conditions: values.targetFilter,
    };
    onChange?.({ key: TargetFilterType.Name, value: cond });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Filter by name</DialogTitle>
        <TargetNameFilterForm form={form} onSubmit={onSubmit}>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                form.watch().targetFilter.some((f) => f.value === "")
              }
            >
              Filter
            </Button>
          </DialogFooter>
        </TargetNameFilterForm>
      </DialogContent>
    </Dialog>
  );
};
