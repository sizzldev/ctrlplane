"use client";

import { useRouter } from "next/navigation";
import LZString from "lz-string";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ctrlplane/ui/table";
import {
  TargetFilterType,
  TargetOperator,
} from "@ctrlplane/validators/targets";

export const CombinationsTable: React.FC<{
  workspaceSlug: string;
  combinations: Array<{
    targets: number;
    metadata: Record<string, string | null>;
  }>;
}> = ({ workspaceSlug, combinations }) => {
  const router = useRouter();
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="text-xs">
          <TableHead>Combinations</TableHead>
          <TableHead>Targets</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {combinations.map((combination, idx) => {
          const { targets, metadata } = combination;
          return (
            <TableRow
              key={idx}
              className="cursor-pointer"
              onClick={() => {
                const query = new URLSearchParams(window.location.search);
                const filterHash = LZString.compressToEncodedURIComponent(
                  JSON.stringify([
                    {
                      key: "metadata",
                      value: {
                        operator: TargetOperator.And,
                        type: TargetFilterType.Comparison,
                        conditions: Object.entries(metadata).map(
                          ([key, value]) => ({
                            operator: TargetOperator.Equals,
                            type: TargetFilterType.Metadata,
                            key,
                            value,
                          }),
                        ),
                      },
                    },
                  ]),
                );
                query.set("filters", filterHash);
                return router.push(
                  `/${workspaceSlug}/targets?${query.toString()}`,
                );
              }}
            >
              <TableCell>
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="text-nowrap font-mono text-xs">
                    <span className="text-red-400">{key}:</span>{" "}
                    {value != null && (
                      <span className="text-green-300">{value}</span>
                    )}
                    {value == null && (
                      <span className="text-neutral-400">null</span>
                    )}
                  </div>
                ))}
              </TableCell>
              <TableCell>{targets}</TableCell>
            </TableRow>
          );
        })}
        <TableRow></TableRow>
      </TableBody>
    </Table>
  );
};
