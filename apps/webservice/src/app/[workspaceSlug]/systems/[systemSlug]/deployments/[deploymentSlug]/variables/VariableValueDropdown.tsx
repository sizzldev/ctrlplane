import type { TargetCondition } from "@ctrlplane/validators/targets";
import { useParams } from "next/navigation";

import { Badge } from "@ctrlplane/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ctrlplane/ui/dropdown-menu";
import { useForm } from "@ctrlplane/ui/form";

import type { TargetFilterFormValues } from "../../../../../_components/filter/TargetConditionForm";
import type { VariableValue } from "./variable-data";
import { api } from "~/trpc/react";
import {
  TargetFilterForm,
  targetFilterForm,
} from "../../../../../_components/filter/TargetConditionForm";



const ConfigureVariableScopeDialog: React.FC<{
  value: VariableValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const form = useForm({
    schema: targetFilterForm,
    defaultValues: {
      operator: value.targetFilter?.operator ?? "and",
      targetFilter: (value.targetFilter?.conditions ?? []) as TargetCondition[],
    },
  });

  const onSubmit = (values: TargetFilterFormValues) => {
    console.log(values);
  };

  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const workspace = api.workspace.bySlug.useQuery(workspaceSlug);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign targets to{" "}
            <Badge variant="secondary" className="text-base">
              {value.value}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            Assign this variable value to a specific target or a group of
            targets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <TargetFilterForm
            form={form}
            workspaceId={workspace.data?.id ?? ""}
            onSubmit={onSubmit}
          >
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </TargetFilterForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const VariableValueDropdown: React.FC<{
  value: VariableValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <ConfigureVariableScopeDialog value={value}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Assign targets
            </DropdownMenuItem>
          </ConfigureVariableScopeDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
