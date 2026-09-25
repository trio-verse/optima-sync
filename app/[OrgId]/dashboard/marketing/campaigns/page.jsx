// marketing/campaign/page.jsx
import { getEffectiveCampaigns } from "@/actions/campaigns";
import CampaignsTable from "@/components/campaigns/CampaignsTable";

export default async function CampaignsPage({ params }) {
  const resolvedParams = await params;
  const orgId = resolvedParams?.OrgId;
<<<<<<< HEAD
  const response = await getEffectiveCampaigns(orgId, { page: 1, perPage: 10 });
=======
  const response = await getEffectiveCampaigns(orgId);
     console.log("############" , response);
>>>>>>> 5fbf3759b64293f8c0cad9a9cf49e306271376f3
  const campaigns = response.success ? response.data : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <CampaignsTable initialCampaigns={campaigns} orgId={orgId} />
    </div>
  );
}