import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  WorkSpace,
  WorkSpaceFilter,
  WorkSpaceStatus,
  WorkspaseState,
} from "@/types/workspaceTypes";
import {
  changeWorkspaceStatus,
  createWorkspace,
  getWorkspaces,
  getWorkspacesStats,
  updateWorkspace,
} from "@/actions/workspaceActions";
import { useState } from "react";

export default function useWorkspaceStore(orgId: string) {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>(
    WorkSpaceFilter.all,
  );
  const queryKey = ["workspaces", orgId, { status: selectedStatus }];

  const statsKey = ["workspace-stats", orgId];



  const workspaceQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const filterParams =
        selectedStatus && selectedStatus !== "all"
          ? { status: selectedStatus }
          : {};
      const response = await getWorkspaces(orgId , filterParams);
      return response.data;
    },
  });
  const statsQuery = useQuery({
    queryKey: statsKey,
    queryFn: async () => await getWorkspacesStats(orgId),
    enabled: !!orgId,
  });
  const createMutation = useMutation({
    mutationFn: async (workspace: WorkSpace) => {
      const response = await createWorkspace(workspace, orgId);
      return response.data;
    },
    onSuccess: (createdWorkspace: WorkSpace) => {
      queryClient.setQueryData<WorkSpace[]>(queryKey, (oldWorkspaces) => [
        createdWorkspace,
        ...(oldWorkspaces || []),
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateMutation = useMutation({
     mutationFn: async (workspace: WorkSpace) => {
      const response = await updateWorkspace(workspace.id , workspace, orgId);
      return response.data;
    },
    onSuccess: (updatedWorkspace: WorkSpace) => {
    queryClient.setQueryData<WorkSpace[]>(
      queryKey,
      (oldWorkspaces) => {
        if (!oldWorkspaces) return oldWorkspaces;

        return oldWorkspaces.map((workspace) =>
          workspace.id === updatedWorkspace.id
            ? updatedWorkspace
            : workspace
        );
      }
    );

 
  },

  onError: (error) => {
    console.log(error);
  },
  });
  
  const changeStatusMutation = useMutation({
    mutationFn: async ({
      workspace,
      status,
    }: {
      workspace: WorkSpace;
      status: WorkSpaceStatus;
    }) => {
      await changeWorkspaceStatus(String(workspace.id ?? ""), status, orgId);
      return { ...workspace, status };
    },
    onSuccess: (updatedWorkspace: WorkSpace) => {
      queryClient.setQueryData<WorkSpace[]>(queryKey, (oldWorkspaces) => {
        if (!oldWorkspaces) return [];
        return oldWorkspaces.map((workspace) =>
          workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace,
        );
      });
      queryClient.invalidateQueries({ queryKey: statsKey });
    },
    
    onError: (error) => {
      console.log(error);
    },
  });
  const workspaceStats: WorkspaseState = statsQuery.data?.data || {
    all_tasks: 0,
    completed_tasks: 0,
    workspace_per_status: [],
  };

  const allTasksCount =
    workspaceStats.all_tasks > 0 ? workspaceStats.all_tasks : 1;
  const percent = (workspaceStats.completed_tasks / allTasksCount) * 100;
  return {
    workspaces: workspaceQuery.data || [],
    isLoading: workspaceQuery.isLoading,
    isError: workspaceQuery.isError,
    error: workspaceQuery.error?.message,
    addWorkspace: createMutation.mutate,
    changeWorkspaceStatus: changeStatusMutation.mutate,
    isAdding: createMutation.isPending,
    submitted: createMutation.isSuccess,
    workspaceStats,
    statsLoading: statsQuery.isLoading,
    percent,
    selectedStatus,
    setSelectedStatus,
    updateWorkspace:updateMutation.mutate,
    isUpdate:updateMutation.isPending,
    updateError: updateMutation.error?.message,
  };
}
