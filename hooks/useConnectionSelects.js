import { useQueries } from "@tanstack/react-query";
import { getProducts } from "@/actions/services/productsService";
import { getChannels } from "@/actions/services/channelService";
import { getMembers } from "@/actions/services/membersAction";
import { getCampaigns } from "@/actions/campaigns";

export function useConnectionSelects(orgId, enabled = true) {
  const results = useQueries({
    queries: [
      {
        queryKey: ["products", orgId],
        queryFn: async () => {
          const res = await getProducts(orgId);
          return res?.success ? res.data || [] : [];
        },
        enabled: enabled && !!orgId,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["channels", orgId],
        queryFn: async () => {
          const res = await getChannels(orgId);
          return res?.success ? res.data || [] : [];
        },
        enabled: enabled && !!orgId,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["members", orgId],
        queryFn: async () => {
          const res = await getMembers(orgId);
          return res?.success ? res.data || [] : [];
        },
        enabled: enabled && !!orgId,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["campaigns", orgId],
        queryFn: async () => {
          const res = await getCampaigns(orgId);
          return res?.success ? res.data || [] : [];
        },
        enabled: enabled && !!orgId,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  const [productsQuery, channelsQuery, membersQuery, campaignsQuery] = results;

  const isLoading = results.some((q) => q.isLoading);

  return {
    products: productsQuery.data || [],
    channels: channelsQuery.data || [],
    members: membersQuery.data || [],
    campaigns: campaignsQuery.data || [],
    loadingProducts: productsQuery.isLoading,
    loadingChannels: channelsQuery.isLoading,
    loadingMembers: membersQuery.isLoading,
    loadingCampaigns: campaignsQuery.isLoading,
    isLoading,
  };
}