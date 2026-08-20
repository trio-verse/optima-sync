import {
  getMarketingAnalytics,
  getEffectiveCampaigns,
  getAllCampaigns,
} from "@/actions/campaigns";
import MarketingAnalyticsDashboard from "@/components/marketing/MarketingAnalyticsDashboard";

export default async function MarketingOverviewPage({ params }) {
  const resolvedParams = await params;
  const orgId = resolvedParams?.OrgId;

  const [analyticsRes, effectiveRes, campaignsRes] = await Promise.all([
    getMarketingAnalytics(orgId),
    getEffectiveCampaigns(orgId),
    getAllCampaigns(orgId),
  ]);

  const analytics = analyticsRes.success ? analyticsRes.data : null;
  const effectiveCampaigns = effectiveRes.success ? effectiveRes.data : [];
  const initialCampaigns = campaignsRes.success ? campaignsRes.data : [];

  return (
    <MarketingAnalyticsDashboard
      orgId={orgId}
      analytics={analytics}
      initialCampaigns={initialCampaigns}
      effectiveCampaigns={effectiveCampaigns}
    />
  );
}