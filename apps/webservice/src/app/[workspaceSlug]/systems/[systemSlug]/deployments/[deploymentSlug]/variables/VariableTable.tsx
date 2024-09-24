"use client";

import type * as schema from "@ctrlplane/db/schema";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { TbDotsVertical, TbPlus, TbSelector, TbVariable } from "react-icons/tb";

import { cn } from "@ctrlplane/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ctrlplane/ui/accordion";
import { Badge } from "@ctrlplane/ui/badge";
import { Button } from "@ctrlplane/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ctrlplane/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ctrlplane/ui/dropdown-menu";
import { Input } from "@ctrlplane/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ctrlplane/ui/table";

import type { VariableData } from "./variable-data";
import { api } from "~/trpc/react";
import { useMatchSorterWithSearch } from "~/utils/useMatchSorter";
import { AddVariableValueDialog } from "../AddVariableValueDialog";
import { VariableValueDropdown } from "./VariableValueDropdown";

export const VariableTable: React.FC<{
  variables: VariableData[];
  deploymentName: string;
}> = ({ variables, deploymentName }) => {
  const del = api.deployment.variable.value.delete.useMutation();
  const router = useRouter();
  const { result, search, setSearch } = useMatchSorterWithSearch(variables, {
    keys: [
      "key",
      "description",
      (i) => i.values.map((v) => JSON.stringify(v.value)),
    ],
  });

  console.log({ result });

  return (
    <>
      <div className="sticky left-0 right-0 top-0 z-20 border-b bg-neutral-950">
        <Input
          value={search}
          className="rounded-none border-none hover:ring-0"
          type="text"
          placeholder="Filter variables..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {result.map((variable, idx) => {
            const numUniqueTargets = _.chain(variable.values)
              .flatMap((v) =>
                v.deploymentVariableValueTargetFilters.map((f) =>
                  f.targets.map((t) => t.id),
                ),
              )
              .compact()
              .uniq()
              .value().length;
            return (
              <Collapsible key={variable.id} asChild>
                <>
                  <TableRow
                    className="border-0" /*className={cn(idx !== 0 && "border-1")} */
                  >
                    <TableCell className="flex items-center gap-2  ">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2 h-6 w-6 py-0 pl-[1px] hover:bg-inherit"
                        >
                          <TbSelector />
                        </Button>
                      </CollapsibleTrigger>
                      {variable.key}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {numUniqueTargets} target
                        {numUniqueTargets === 1 ? "" : "s"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end ">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <TbDotsVertical />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <>
                      {variable.values.map((v) => {
                        const numTargets =
                          v.deploymentVariableValueTargetFilters.map((f) =>
                            f.targets.map((t) => t.id),
                          );

                        return (
                          <TableRow
                            key={v.id}
                            className="border-none" /* className="border-none py-0" */
                          >
                            <TableCell className="pl-12">{v.value}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {numTargets.length} target
                                {numTargets.length === 1 ? "" : "s"}
                              </Badge>
                            </TableCell>
                            <TableCell className="flex justify-end">
                              <VariableValueDropdown variable={variable}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <TbDotsVertical />
                                </Button>
                              </VariableValueDropdown>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  </CollapsibleContent>
                </>
              </Collapsible>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
