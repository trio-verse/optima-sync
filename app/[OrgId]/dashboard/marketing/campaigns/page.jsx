// marketing/campaign/page.jsx
import { getEffectiveCampaigns } from "@/actions/campaigns";
import CampaignsTable from "@/components/campaigns/CampaignsTable";

export default async function CampaignsPage({ params }) {
  const resolvedParams = await params;
  const orgId = resolvedParams?.OrgId;
  const response = await getEffectiveCampaigns(orgId);
     console.log("############" , response);
  const campaigns = response.success ? response.data : [];
  if(response.success){
    console.log("hccccccccccc",response.data);
  }
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <CampaignsTable initialCampaigns={campaigns} orgId={orgId} />
    </div>
  );
}
