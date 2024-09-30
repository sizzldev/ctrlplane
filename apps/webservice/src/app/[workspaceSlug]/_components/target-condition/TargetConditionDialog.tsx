import type { TargetCondition } from "@ctrlplane/validators/targets";
import React, { useEffect, useState } from "react";

import { Button } from "@ctrlplane/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ctrlplane/ui/dialog";
import {
  defaultCondition,
  isDefaultCondition,
  isValidTargetCondition,
  MAX_DEPTH_ALLOWED,
} from "@ctrlplane/validators/targets";

import { TargetConditionRender } from "./TargetConditionRender";

type TargetConditionDialogProps = {
  condition?: TargetCondition;
  onChange: (condition: TargetCondition | undefined) => void;
  children: React.ReactNode;
};

export const TargetConditionDialog: React.FC<TargetConditionDialogProps> = ({
  condition,
  onChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localCondition, setLocalCondition] = useState(
    condition ?? defaultCondition,
  );
  useEffect(() => {
    setLocalCondition(condition ?? defaultCondition);
  }, [condition]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Edit Target Filter</DialogTitle>
          <DialogDescription>
            Edit the target filter for this environment, up to a depth of{" "}
            {MAX_DEPTH_ALLOWED + 1}.
          </DialogDescription>
        </DialogHeader>
        <TargetConditionRender
          condition={localCondition}
          onChange={setLocalCondition}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setLocalCondition(defaultCondition);
              setError(null);
            }}
          >
            Clear
          </Button>
          <div className="flex-grow" />
          <Button
            onClick={() => {
              if (!isValidTargetCondition(localCondition)) {
                setError(
                  "Invalid target condition, ensure all fields are filled out correctly.",
                );
                return;
              }
              onChange(
                isDefaultCondition(localCondition) ? undefined : localCondition,
              );
              setOpen(false);
              setError(null);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
