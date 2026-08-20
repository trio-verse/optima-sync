// marketing/campaign/page.jsx
import { getCampaigns } from "@/actions/campaigns";
import CampaignsTable from "@/components/campaigns/CampaignsTable";

export default async function CampaignsPage({ params }) {
  const resolvedParams = await params;
  const orgId = resolvedParams?.OrgId;
  const response = await getCampaigns(orgId);
  const campaigns = response.success ? response.data : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <CampaignsTable initialCampaigns={campaigns} orgId={orgId} />
    </div>
  );
}
