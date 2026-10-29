import {
  getCampaignAnalytics,
  getCampaignContents,
} from "@/actions/campaignDetails";
import { CampaignStats } from "@/types";
import CampaignStatsComp from "./CampaignStatsComp";

interface CampaignDetailsPageProps {
  params: Promise<{ OrgId: string; id: number }>;
}
export default async function CampaignDetailsPage({
  params,
}: CampaignDetailsPageProps) {
  const resolvedParams = await params;
  const campaignId = resolvedParams?.id;
  const orgId = resolvedParams?.OrgId;

  const [analyticsRes, contentsRes] = await Promise.all([
    getCampaignAnalytics(campaignId, orgId),
    getCampaignContents(campaignId, orgId),
  ]);

  const rawData = analyticsRes.data as CampaignStats;
 
  return (
    <CampaignStatsComp
      rawData={rawData}
      campaignId={campaignId}
      contentsRes={contentsRes}
      orgId={orgId}
    />
  );
}
