import type { UseFormReturn } from "react-hook-form";
import { TbX } from "react-icons/tb";
import { z } from "zod";

import { Button } from "@ctrlplane/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ctrlplane/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useFieldArray,
} from "@ctrlplane/ui/form";
import { Input } from "@ctrlplane/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ctrlplane/ui/select";
import { targetCondition } from "@ctrlplane/validators/targets";

import { api } from "~/trpc/react";
import { MetadataFilterInput } from "../MetadataFilterInput";
import { TargetKindCombobox } from "./TargetKindFilterForm";

export const targetFilterForm = z.object({
  operator: z.enum(["and", "or"]),
  targetFilter: z.array(targetCondition),
});

export type TargetFilterFormValues = z.infer<typeof targetFilterForm>;

type TargetConditionFormProps = {
  form: UseFormReturn<TargetFilterFormValues>;
  onSubmit: (values: TargetFilterFormValues) => void;
  workspaceId: string;
  children?: React.ReactNode;
};

export const TargetFilterForm: React.FC<TargetConditionFormProps> = ({
  form,
  onSubmit,
  workspaceId,
  children,
}) => {
  const onFormSubmit = form.handleSubmit(onSubmit);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "targetFilter",
  });

  const kinds = api.workspace.targetKinds.useQuery(workspaceId);
  const newKinds = (kinds.data ?? []).filter(
    (kind) =>
      !fields
        .filter((field) => field.type === "kind")
        .some((field) => field.value === kind),
  );

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="space-y-4">
        {fields.length > 1 && (
          <FormField
            control={form.control}
            name="operator"
            render={({ field: { onChange, value } }) => (
              <FormItem className="w-24">
                <FormControl>
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">And</SelectItem>
                      <SelectItem value="or">Or</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`targetFilter.${index}`}
            render={({ field: { onChange, value } }) => (
              <FormItem className={index === 0 ? "mt-0" : "mt-2"}>
                <FormControl>
                  <>
                    {value.type === "metadata" && (
                      <MetadataFilterInput
                        selectedKeys={fields
                          .filter((field) => field.type === "metadata")
                          .map(
                            (field) => field.operator !== "null" && field.value,
                          )
                          .filter((f) => f !== false)}
                        value={value}
                        workspaceId={workspaceId}
                        onChange={onChange}
                        onRemove={() => remove(index)}
                      />
                    )}

                    {value.type === "name" && (
                      <div className="flex w-full items-center">
                        <div className="flex-shrink-0 rounded-l-md border border-r-0 bg-neutral-900/50 py-[5px] pl-2">
                          <span className="mr-2 text-sm">Name like</span>
                        </div>
                        <Input
                          value={value.value.replace(/^%|%$/g, "")}
                          onChange={(e) =>
                            onChange({
                              ...value,
                              value: `%${e.target.value}%`,
                            })
                          }
                          className="rounded-l-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-6 w-6"
                          onClick={() => remove(index)}
                        >
                          <TbX />
                        </Button>
                      </div>
                    )}

                    {value.type === "kind" && (
                      <div className="flex w-full items-center">
                        <div className="flex-shrink-0 rounded-l-md border border-r-0 bg-neutral-900/50 px-3 py-[5px]">
                          <span className="mr-[14px] text-sm">Kind is</span>
                        </div>
                        <TargetKindCombobox
                          newKinds={newKinds}
                          value={form.watch(`targetFilter.${index}.value`)}
                          onSelect={(kind) => {
                            onChange({
                              ...value,
                              value: kind,
                            });
                          }}
                          className="w-full rounded-l-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-6 w-6"
                          onClick={() => remove(index)}
                        >
                          <TbX />
                        </Button>
                      </div>
                    )}
                  </>
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="mt-4">
              Add Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onSelect={() => {
                append({
                  key: "",
                  value: "",
                  operator: "equals",
                  type: "metadata",
                });
              }}
            >
              Metadata
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                append({
                  value: "",
                  operator: "equals",
                  type: "kind",
                });
              }}
            >
              Kind
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                append({
                  value: "",
                  operator: "equals",
                  type: "name",
                });
              }}
            >
              Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {children}
      </form>
    </Form>
  );
};
