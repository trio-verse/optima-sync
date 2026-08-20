import ContentForm from "@/components/campaigns/[id]/ContentForm";

export default async function CreateContentPage({ params }) {
   const resolvedParams = await params;
  const campaignId = resolvedParams?.id;
  const orgId = resolvedParams?.OrgId;

  return (
    <div className="p-6">
      <ContentForm campaignId={campaignId} orgId={orgId} />
    </div>
  );
}