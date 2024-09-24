"use client";

import type { UseFormReturn } from "react-hook-form";
import React from "react";
import { z } from "zod";

import { Button } from "@ctrlplane/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useFieldArray,
} from "@ctrlplane/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ctrlplane/ui/select";
import { metadataCondition } from "@ctrlplane/validators/targets";

import { MetadataFilterInput } from "../MetadataFilterInput";

export const metadataFilterForm = z.object({
  operator: z.enum(["and", "or"]),
  targetFilter: z.array(metadataCondition),
});

export type MetadataFilterForm = z.infer<typeof metadataFilterForm>;

type TargetMetadataFilterFormProps = {
  form: UseFormReturn<MetadataFilterForm>;
  workspaceId: string;
  onSubmit: (values: MetadataFilterForm) => void;
  allowFirstConditionRemove?: boolean;
  children?: React.ReactNode;
};

export const TargetMetadataFilterForm: React.FC<
  TargetMetadataFilterFormProps
> = ({
  form,
  workspaceId,
  onSubmit,
  allowFirstConditionRemove = true,
  children,
}) => {
  const onFormSubmit = form.handleSubmit(onSubmit);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "targetFilter",
  });

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
                  <MetadataFilterInput
                    selectedKeys={fields
                      .map((field) => field.operator !== "null" && field.value)
                      .filter((f) => f !== false)}
                    value={value}
                    workspaceId={workspaceId}
                    onChange={onChange}
                    onRemove={() => remove(index)}
                    numInputs={
                      allowFirstConditionRemove ? undefined : fields.length
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            append({
              key: "",
              value: "",
              operator: "equals",
              type: "metadata",
            })
          }
        >
          Add Metadata Key
        </Button>

        {children}
      </form>
    </Form>
  );
};
