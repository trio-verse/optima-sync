"use client";
import ProgressBar from "@/components/ui/ProgressBar";
import WorkspaceStateCard from "@/components/workspace/WorkspaceStateCard";
import FilterItem from "@/components/workspace/FilterItem";
import WorkspaceItemCard from "@/components/workspace/WorkspaceItemCard";
import { WorkSpaceFilter, WorkSpaceStatus } from "@/types/workspaceTypes";
import { Model } from "@/components/ui/Model";
import WorkspaceForm from "@/components/workspace/WorkspaceForm";
import { use } from "react";
import useWorkspaceStore from "@/hooks/useWorkspaceStore";
import LoadingCard from "@/components/ui/LoadingCard";

const workspaceFilters = Object.entries(WorkSpaceFilter).map(([key, value]) => {
  return { key: key, value: value };
});
interface WorkspacePageProps {
  params: Promise<{ OrgId: string }>;
}

const Workspace = ({ params }: WorkspacePageProps) => {
  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;
  const {
    workspaces,
    isLoading,
    isError,
    error,
    workspaceStats,
    percent,
    selectedStatus,
    setSelectedStatus,
  } = useWorkspaceStore(orgId);

  

  if (isError) return <div className="">{error}</div>;

  return (
    <div className="w-full p-2">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Workspace</h2>
        <Model
          isbackDropClose={false}
          title="Add New Workspace"
          buttonText="Add New Workspace"
        >
          {(closeModal) => (
            <WorkspaceForm OrgId={orgId} onSuccessClose={closeModal} />
          )}
        </Model>
      </div>
      <hr className="my-5" />
      <div className="w-full flex flex-row justify-between gap-5">
        <WorkspaceStateCard
          color="blue"
          title="completed"
          value={
            workspaceStats?.workspace_per_status[WorkSpaceStatus.completed] ?? 0
          }
        />
        <WorkspaceStateCard
          color="green"
          title="active"
          value={
            workspaceStats?.workspace_per_status[WorkSpaceStatus.active] ?? 0
          }
        />
        <WorkspaceStateCard
          color="red"
          title="archived"
          value={
            workspaceStats?.workspace_per_status[WorkSpaceStatus.archived] ?? 0
          }
        />
      </div>
      <ProgressBar value={percent} />
          
      <div className="flex flex-row justify-between gap-6">
        {workspaceFilters.map((value, index) => {
          return (
            <FilterItem
              key={index}
              title={value.value}
              value={value.value}
              name="filter"
              selectedValue={selectedStatus}
              onSelect={(val) => setSelectedStatus(val)}
            />
          );
        })}
      </div>
      
      <div className="w-full space-y-4 mt-5">
        {isLoading &&<LoadingCard title="workspaces"/>}
        {workspaces &&
          workspaces.map((workspace, index) => {
            return (
              <WorkspaceItemCard
                key={index}
                link={`/${orgId}/dashboard/workspace/${workspace.id}/tasks`}
                workspace={workspace}
                limit={workspace.limit}
                OrgId={orgId}
                onSubmit={() => {}}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Workspace;
