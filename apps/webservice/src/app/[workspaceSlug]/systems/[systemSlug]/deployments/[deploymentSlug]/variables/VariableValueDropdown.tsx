import { useState } from "react";
import { useParams } from "next/navigation";
import { TbX } from "react-icons/tb";
import { z } from "zod";

import { Badge } from "@ctrlplane/ui/badge";
import { Button } from "@ctrlplane/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ctrlplane/ui/command";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useFieldArray,
  useForm,
} from "@ctrlplane/ui/form";
import { Label } from "@ctrlplane/ui/label";
import { RadioGroup, RadioGroupItem } from "@ctrlplane/ui/radio-group";
import { targetCondition } from "@ctrlplane/validators/targets";

import type { VariableData } from "./variable-data";
import { api } from "~/trpc/react";

const variableScopeTargetFiltersFormSchema = z.object({
  targetFilters: z.array(targetCondition),
});

const ConfigureVariableScopeDialog: React.FC<{
  variable: VariableData;
  children: React.ReactNode;
}> = ({ variable, children }) => {
  const [search, setSearch] = useState("");

  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const workspace = api.workspace.bySlug.useQuery(workspaceSlug);

  const targets = api.target.byWorkspaceId.list.useQuery(
    {
      workspaceId: workspace.data?.id ?? "",
      filters:
        search != ""
          ? [
              {
                type: "comparison",
                operator: "or",
                conditions: [
                  {
                    type: "name",
                    operator: "like",
                    value: `%${search}%`,
                  },
                ],
              },
            ]
          : [],
    },
    { enabled: workspace.isSuccess && workspace.data?.id !== "" },
  );

  const targetFilterForm = useForm({
    schema: variableScopeTargetFiltersFormSchema,
    defaultValues: {
      targetFilters: [],
    },
  });

  const targetFilterFormFields = useFieldArray({
    control: targetFilterForm.control,
    name: "targetFilters",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign targets to{" "}
            <Badge variant="secondary" className="text-base">
              {variable.key}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            Assign this variable value to a specific target or a group of
            targets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8"></div>
      </DialogContent>
    </Dialog>
  );
};

export const VariableValueDropdown: React.FC<{
  variable: VariableData;
  children: React.ReactNode;
}> = ({ variable, children }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <ConfigureVariableScopeDialog variable={variable}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Assign targets
            </DropdownMenuItem>
          </ConfigureVariableScopeDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
