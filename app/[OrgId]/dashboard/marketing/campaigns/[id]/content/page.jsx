import ContentForm from "@/components/campaigns/[id]/ContentForm";
import { getCampaignContents } from "@/actions/campaignDetails";

export default async function ContentPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const campaignId = resolvedParams?.id;
  const orgId = resolvedParams?.OrgId;
  const contentId = resolvedSearchParams?.contentId ? Number(resolvedSearchParams.contentId) : null;

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