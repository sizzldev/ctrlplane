import { notFound, useRouter } from "next/navigation";

import { Badge } from "@ctrlplane/ui/badge";

import { api } from "~/trpc/server";
import { CombinationsTable } from "./CombincationsTable";

export default async function TargetLabelGroupPages({
  params,
}: {
  params: { workspaceSlug: string; groupId: string };
}) {
  const { workspaceSlug, groupId } = params;
  const labelGroup = await api.target.labelGroup.byId(groupId).catch(notFound);
  return (
    <div>
      <div className="flex items-center gap-3 border-b p-4 px-8 text-xl">
        <span className="">{labelGroup.name}</span>
        <Badge className="rounded-full text-muted-foreground" variant="outline">
          {labelGroup.groups.length}
        </Badge>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900 h-[calc(100vh-110px)] w-full overflow-auto">
        <CombinationsTable
          workspaceSlug={workspaceSlug}
          groups={labelGroup.groups}
        />
      </div>
    </div>
  );
}
