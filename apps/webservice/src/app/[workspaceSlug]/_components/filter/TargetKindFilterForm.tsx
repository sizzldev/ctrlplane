import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { TbSelector, TbX } from "react-icons/tb";
import { z } from "zod";

import { cn } from "@ctrlplane/ui";
import { Badge } from "@ctrlplane/ui/badge";
import { Button } from "@ctrlplane/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ctrlplane/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useFieldArray,
} from "@ctrlplane/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@ctrlplane/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ctrlplane/ui/select";
import { kindEqualsCondition } from "@ctrlplane/validators/targets";

export const targetKindFilterForm = z.object({
  operator: z.enum(["and", "or"]),
  targetFilter: z.array(kindEqualsCondition),
});

export type TargetKindFilterFormValues = z.infer<typeof targetKindFilterForm>;

type TargetKindFilterFormProps = {
  form: UseFormReturn<TargetKindFilterFormValues>;
  kinds: string[];
  onSubmit: (values: TargetKindFilterFormValues) => void;
  children?: React.ReactNode;
};

export const TargetKindCombobox: React.FC<{
  newKinds: string[];
  onSelect: (kind: string) => void;
  className?: string;
  contentWidth?: string;
  value?: string;
}> = ({ newKinds, onSelect, className, contentWidth, value }) => {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <Popover open={commandOpen} onOpenChange={setCommandOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={commandOpen}
          className={cn(
            "w-full items-center justify-start gap-2 px-2",
            className,
          )}
        >
          <TbSelector />
          <span>
            {value != null && value.length > 0 ? value : "Select kind..."}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("p-0", contentWidth ?? "w-[462px]")}
      >
        <Command>
          <CommandInput placeholder="Search kind..." />
          <CommandGroup>
            <CommandList>
              {newKinds.length === 0 && (
                <CommandItem disabled>No kinds to add</CommandItem>
              )}
              {newKinds.map((kind) => (
                <CommandItem
                  key={kind}
                  value={kind}
                  onSelect={() => {
                    onSelect(kind);
                    setCommandOpen(false);
                  }}
                >
                  {kind}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const TargetKindFilterForm: React.FC<TargetKindFilterFormProps> = ({
  form,
  kinds,
  onSubmit,
  children,
}) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "targetFilter",
  });

  const onFormSubmit = form.handleSubmit(onSubmit);

  const newKinds = kinds.filter(
    (kind) => !fields.some((field) => field.value === kind),
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

        <div>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`targetFilter.${index}`}
              render={({ field: { value } }) => (
                <div className="mb-2 mr-2 inline-block">
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex w-fit gap-1 p-1 pl-2 text-sm"
                  >
                    {value.value}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => remove(index)}
                    >
                      <TbX />
                    </Button>
                  </Badge>
                </div>
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <Popover open={commandOpen} onOpenChange={setCommandOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={commandOpen}
                className="w-full items-center justify-start gap-2 px-2"
              >
                <TbSelector />
                <span>Select kind...</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[462px] p-0">
              <Command>
                <CommandInput placeholder="Search kind..." />
                <CommandGroup>
                  <CommandList>
                    {newKinds.length === 0 && (
                      <CommandItem disabled>No kinds to add</CommandItem>
                    )}
                    {newKinds.map((kind) => (
                      <CommandItem
                        key={kind}
                        value={kind}
                        onSelect={() => {
                          append({
                            operator: "equals",
                            value: kind,
                            type: "kind",
                          });
                          setCommandOpen(false);
                        }}
                      >
                        {kind}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {children}
      </form>
    </Form>
  );
};
