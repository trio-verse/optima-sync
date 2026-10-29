import ContentForm from "@/components/campaigns/[id]/ContentForm";
import { getCampaignContents } from "@/actions/campaignDetails";

interface ContentPageProps {
  params: Promise<{ OrgId: string; id: number; contentId:number }>;
}
export default async function ContentPage({ params}: ContentPageProps) {
  const resolvedParams = await params;
  const campaignId = resolvedParams?.id;
  const orgId = resolvedParams?.OrgId;
  const contentId = resolvedParams?.contentId;

  let editingContent = null;

  if (contentId) {
    const res = await getCampaignContents(campaignId, orgId);
    const contents = res?.data || [];
    editingContent = contents.find((c) => c.id === contentId) || null;
  }

  return (
    <div className="p-6">
      <ContentForm
        campaignId={campaignId}
        orgId={orgId}
        editingContent={editingContent}
      />
    </div>
  );
}