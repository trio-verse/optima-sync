import { useQuery } from "@tanstack/react-query";
import {
  getMarketingAnalytics,
  getEffectiveCampaigns,
  getAllCampaigns,
} from "@/actions/campaigns";

export function useMarketingAnalytics(orgId) {
  const STALE_TIME = 1000 * 60 * 5; 

  // Query 1: Analytics Data
  const analyticsQuery = useQuery({
    queryKey: ["marketingAnalytics", orgId],
    queryFn: async () => {
      const res = await getMarketingAnalytics(orgId);
      if (!res?.success) throw new Error(res?.error || "Failed to fetch analytics");
      return res.data;
    },
    enabled: !!orgId,
    staleTime: STALE_TIME,
  });

  // Query 2: Effective Campaigns
  const effectiveQuery = useQuery({
    queryKey: ["effectiveCampaigns", orgId],
    queryFn: async () => {
      const res = await getEffectiveCampaigns(orgId);
      if (!res?.success) throw new Error(res?.error || "Failed to fetch effective campaigns");
      return res.data;
    },
    enabled: !!orgId,
    staleTime: STALE_TIME,
  });

  // Query 3: All Campaigns
  const campaignsQuery = useQuery({
    queryKey: ["allCampaigns", orgId],
    queryFn: async () => {
      const res = await getAllCampaigns(orgId);
      if (!res?.success) throw new Error(res?.error || "Failed to fetch campaigns");
      return res.data;
    },
    enabled: !!orgId,
    staleTime: STALE_TIME,
  });

  const isLoading =
    analyticsQuery.isLoading ||
    effectiveQuery.isLoading ||
    campaignsQuery.isLoading;

  const isError =
    analyticsQuery.isError ||
    effectiveQuery.isError ||
    campaignsQuery.isError;

  return {
    analytics: analyticsQuery.data ?? null,
    effectiveCampaigns: effectiveQuery.data ?? [],
    campaigns: campaignsQuery.data ?? [],
    isLoading,
    isError,
    queries: {
      analytics: analyticsQuery,
      effective: effectiveQuery,
      campaigns: campaignsQuery,
    },
  };
}