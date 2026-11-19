import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspaceMember,
  getWorkspaceMembers,
  deleteWorkspaceMember,
} from "@/actions/workspaceMember";
import { WorkSpaceMembers } from "@/types/workspaceTypes";
import { OrgMember } from "@/types";


export default function useMemberStore(workspaceId: string, orgId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["workSpaceMember", orgId, workspaceId];
  const membersQuery = useQuery({
    queryKey,
    queryFn: async () => (await getWorkspaceMembers(orgId,workspaceId)).data,
  });
  const createMemberMutation = useMutation({
    mutationFn: async (formData: OrgMember) =>
      (await createWorkspaceMember(orgId, workspaceId, formData)).data,
    onSuccess: (createdMember) => {
      if (!createdMember) return; 
      queryClient.setQueryData<OrgMember[]>(queryKey, (members = []) => [
        createdMember,
        ...members,
      ]);
    },
  });
  const deleteWorkspaceMemberMutation = useMutation({
    mutationFn: async (memberId: string | number) => {
      await deleteWorkspaceMember(orgId, workspaceId, memberId);
      return memberId;
    },
    onSuccess: (memberId) => {
      queryClient.setQueryData<OrgMember[]>(queryKey, (members) => {
        return members.filter((member) => {
          return member.id !== memberId;
        });
      });
    },
  });
  return {
    members: membersQuery.data ?? [],
    isLoading: membersQuery.isLoading,
    isError: membersQuery.isError,
    error: membersQuery.error?.message,
    isSubmiting: createMemberMutation.isPending,
    createMember: createMemberMutation.mutate,
    deleteMember: deleteWorkspaceMemberMutation.mutate,
  };
}
