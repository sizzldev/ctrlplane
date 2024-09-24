import type {
  ComparisonCondition,
  KindEqualsCondition,
} from "@ctrlplane/validators/targets";
import type React from "react";
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

import type { TargetKindFilterFormValues } from "../../_components/filter/TargetKindFilterForm";
import type { TargetFilter } from "./TargetFilter";
import {
  targetKindFilterForm,
  TargetKindFilterForm,
} from "../../_components/filter/TargetKindFilterForm";

export const KindFilterDialog: React.FC<{
  kinds: string[];
  children: React.ReactNode;
  onChange?: (filter: TargetFilter) => void;
  filter?: ComparisonCondition;
}> = ({ kinds, children, onChange, filter }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    schema: targetKindFilterForm,
    defaultValues: {
      operator:
        filter?.operator === TargetOperator.Or
          ? TargetOperator.Or
          : TargetOperator.And,
      targetFilter:
        (filter?.conditions as KindEqualsCondition[] | undefined) ?? [],
    },
  });

  const onSubmit = (values: TargetKindFilterFormValues) => {
    const cond = {
      type: TargetFilterType.Comparison as const,
      operator: values.operator,
      conditions: values.targetFilter,
    };
    onChange?.({ key: "kind", value: cond });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Filter by kind</DialogTitle>
        <TargetKindFilterForm form={form} kinds={kinds} onSubmit={onSubmit}>
          <DialogFooter>
            <Button type="submit">Filter</Button>
          </DialogFooter>
        </TargetKindFilterForm>
      </DialogContent>
    </Dialog>
  );
};
