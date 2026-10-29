import {
  getMarketingAnalytics,
  getEffectiveCampaigns,
  getAllCampaigns,
} from "@/actions/campaigns";
import MarketingAnalyticsDashboard from "@/components/marketing/MarketingAnalyticsDashboard";
interface MarketingOverviewPageProps {
  params: Promise<{ OrgId: string }>;
}
export default async function MarketingOverviewPage({ params }: MarketingOverviewPageProps) {
  const resolvedParams = await params;
  const orgId = resolvedParams?.OrgId;

  // جلب البيانات بشكل متوازي لسرعة الأداء
  const [analyticsRes, effectiveRes, campaignsRes] = await Promise.all([
    getMarketingAnalytics(orgId),
    getEffectiveCampaigns(orgId),
    getAllCampaigns(orgId),
  ]);

  // استخراج البيانات مع قيم افتراضية حذرة عند الفشل
  const analytics = analyticsRes?.success ? analyticsRes.data : null;
  const effectiveCampaigns = effectiveRes?.success ? effectiveRes.data : [];
  const initialCampaigns = campaignsRes?.success ? campaignsRes.data : [];

  return (
    <MarketingAnalyticsDashboard
      orgId={orgId}
      analytics={analytics}
      initialCampaigns={initialCampaigns}
      effectiveCampaigns={effectiveCampaigns}
    />
  );
}