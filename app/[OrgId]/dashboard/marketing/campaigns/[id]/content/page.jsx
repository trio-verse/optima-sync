import ContentForm from "@/components/campaigns/[id]/ContentForm";

export default async function CreateContentPage({ params, searchParams }) {
  const { campaignId } = await params;
  const resolvedParams = await params;
  const orgId = resolvedParams?.OrgId;

  return (
    <div className="p-6">
      <ContentForm campaignId={campaignId} orgId={orgId} />
    </div>
  );
}