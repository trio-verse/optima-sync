"use client";

import { getcities } from "@/actions/services/cityService";
import { getindustries } from "@/actions/services/industryService";
import { useQuery } from "@tanstack/react-query";

export function useClientLookups(orgId) {
  const { data, isLoading } = useQuery({
    queryKey: ["clientLookups", orgId], 
    queryFn: async () => {
      console.log("🔥 [LOOKUPS API CALL] Fetching cities & industries from server...");
      const [citiesRes, industriesRes] = await Promise.all([
        getcities(orgId),
        getindustries(orgId),
      ]);
      return {
        cities: citiesRes.data || [],
        industries: industriesRes.data || [],
      };
    },
    staleTime: 1000 * 60 , 
    enabled: !!orgId,
  });

  return {
    cities: data?.cities || [],
    industries: data?.industries || [],
    loadingLookups: isLoading,
  };
}