import type { UseFormReturn } from "react-hook-form";
import { TbX } from "react-icons/tb";
import { z } from "zod";

import { Button } from "@ctrlplane/ui/button";
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
import {
  nameCondition,
  TargetFilterType,
  TargetOperator,
} from "@ctrlplane/validators/targets";

export const targetNameFilterForm = z.object({
  operator: z.enum(["and", "or"]),
  targetFilter: z.array(nameCondition),
});

export type TargetNameFilterFormValues = z.infer<typeof targetNameFilterForm>;

type TargetNameFilterFormProps = {
  form: UseFormReturn<TargetNameFilterFormValues>;
  onSubmit: (values: TargetNameFilterFormValues) => void;
  children?: React.ReactNode;
};

export const TargetNameFilterForm: React.FC<TargetNameFilterFormProps> = ({
  form,
  onSubmit,
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
                  <div className="flex w-full items-center gap-2">
                    <div className="flex w-full items-center">
                      <Input
                        value={value.value.replace(/^%|%$/g, "")}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            value: `%${e.target.value}%`,
                          })
                        }
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => remove(index)}
                      >
                        <TbX />
                      </Button>
                    )}
                  </div>
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
              value: "",
              operator: TargetOperator.Like,
              type: TargetFilterType.Name,
            })
          }
        >
          Add Name Filter
        </Button>

        {children}
      </form>
    </Form>
  );
};
