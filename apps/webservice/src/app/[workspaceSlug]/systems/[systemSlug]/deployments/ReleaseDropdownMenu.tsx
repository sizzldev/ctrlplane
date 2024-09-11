"use client";

import type {
  EnvironmentPolicyApprovalRequirement,
  EnvironmentPolicyApprovalStatus,
} from "@ctrlplane/db/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TbAlertTriangle,
  TbArrowBack,
  TbDotsVertical,
  TbReload,
} from "react-icons/tb";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ctrlplane/ui/alert-dialog";
import { Badge } from "@ctrlplane/ui/badge";
import { Button, buttonVariants } from "@ctrlplane/ui/button";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ctrlplane/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@ctrlplane/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ctrlplane/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ctrlplane/ui/tooltip";

import { api } from "~/trpc/react";

const RedeployReleaseDialog: React.FC<{
  release: {
    id: string;
    name: string;
  };
  environment: {
    id: string;
    name: string;
  };
  children: React.ReactNode;
}> = ({ release, environment, children }) => {
  const router = useRouter();
  const redeploy = api.release.deploy.toEnvironment.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Redeploy{" "}
            <Badge variant="secondary" className="h-7 text-lg">
              {release.name}
            </Badge>{" "}
            to {environment.name}?
          </DialogTitle>
          <DialogDescription>
            This will redeploy the release to all targets in the environment.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() =>
              redeploy
                .mutateAsync({
                  environmentId: environment.id,
                  releaseId: release.id,
                })
                .then(() => router.refresh())
            }
          >
            Redeploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ForceReleaseDialog: React.FC<{
  release: {
    id: string;
    name: string;
  };
  environment: {
    id: string;
    name: string;
  };
  children: React.ReactNode;
}> = ({ release, environment, children }) => {
  const forceDeploy = api.release.deploy.toEnvironment.useMutation();
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Force release {release.name} to {environment.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will force the release to be deployed to all targets in the
            environment regardless of any policies set on the environment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <div className="flex-grow" />
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() =>
              forceDeploy
                .mutateAsync({
                  environmentId: environment.id,
                  releaseId: release.id,
                  isForcedRelease: true,
                })
                .then(() => router.refresh())
            }
          >
            Force deploy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const RollbackReleaseDialog: React.FC<{
  validReleasesForRollback: {
    id: string;
    version: string;
  }[];
  deployment: {
    name: string;
  };
  environment: {
    id: string;
    name: string;
  };
  children: React.ReactNode;
}> = ({ validReleasesForRollback, deployment, environment, children }) => {
  const [open, setOpen] = useState(false);
  const rollback = api.environment.rollback.useMutation();
  const router = useRouter();

  const form = useForm({
    schema: z.object({
      releaseId: z.string(),
    }),
    defaultValues: {
      releaseId: validReleasesForRollback[0]?.id ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async ({ releaseId }) => {
    await rollback.mutateAsync({
      environmentId: environment.id,
      releaseId,
    });
    router.refresh();
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Rollback {deployment.name} on {environment.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will rollback the release to a previous version. If this is not
            the latest release, only targets without a newer release will be
            rolled back.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="releaseId"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Release</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a release" />
                      </SelectTrigger>
                      <SelectContent>
                        {validReleasesForRollback.map((release) => (
                          <SelectItem key={release.id} value={release.id}>
                            {release.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter className="flex">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <div className="flex-grow" />
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={onSubmit}
          >
            Rollback
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export const ReleaseDropdownMenu: React.FC<{
  release: {
    id: string;
    name: string;
  };
  environment: {
    id: string;
    name: string;
    policy?: {
      approvalStatuses: {
        releaseId: string;
        status: EnvironmentPolicyApprovalStatus;
      }[];
      approvalRequirement?: EnvironmentPolicyApprovalRequirement;
    };
  };
  deployment: {
    id: string;
    name: string;
  };
  isReleaseCompleted: boolean;
}> = ({ release, environment, deployment, isReleaseCompleted }) => {
  const releases = api.release.list.useQuery({ deploymentId: deployment.id });

  // this query returns list of releases ordered by created at descending
  // for rollback, we only want to show releases prior to this release

  const indexOfCurrentRelease = (releases.data ?? []).findIndex(
    (r) => r.id === release.id,
  );

  const releasesPriorToCurrentRelease = (releases.data ?? []).slice(
    Math.min(indexOfCurrentRelease + 1, (releases.data ?? []).length - 1),
    (releases.data ?? []).length,
  );

  const validReleasesForRollback =
    environment.policy?.approvalRequirement === "manual"
      ? releasesPriorToCurrentRelease.filter((r) =>
          environment.policy?.approvalStatuses.some(
            (status) =>
              status.releaseId === r.id && status.status === "approved",
          ),
        )
      : releasesPriorToCurrentRelease;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <TbDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <RedeployReleaseDialog release={release} environment={environment}>
          <DropdownMenuItem
            disabled={!isReleaseCompleted}
            onSelect={(e) => e.preventDefault()}
            className="space-x-2"
          >
            <TbReload />
            <span>Redeploy</span>
          </DropdownMenuItem>
        </RedeployReleaseDialog>
        <ForceReleaseDialog release={release} environment={environment}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="space-x-2"
          >
            <TbAlertTriangle />
            <span>Force deploy</span>
          </DropdownMenuItem>
        </ForceReleaseDialog>
        {validReleasesForRollback.length > 0 ? (
          <RollbackReleaseDialog
            validReleasesForRollback={validReleasesForRollback}
            deployment={deployment}
            environment={environment}
          >
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="space-x-2"
            >
              <TbArrowBack />
              <span>Rollback</span>
            </DropdownMenuItem>
          </RollbackReleaseDialog>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="space-x-2"
                    disabled
                  >
                    <TbArrowBack />
                    <span>Rollback</span>
                  </DropdownMenuItem>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  No releases to rollback to. Either this is the first release,
                  or prior releases are waiting on approval
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
