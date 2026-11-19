import { getMembers } from "@/actions/services/membersAction";
import { getTasks } from "@/actions/taskActions";
import { OrgMember } from "@/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export default function useOrgMemberStore(orgId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["org-members", orgId];
  const memberQuery = useQuery({
    queryKey,
    queryFn: async () => (await getMembers(orgId)).data,
  });

  return {
    orgMembers: memberQuery.data,
    isloading: memberQuery.isLoading,
    isError: memberQuery.isError,
    error: memberQuery.error?.message,
  };
}
