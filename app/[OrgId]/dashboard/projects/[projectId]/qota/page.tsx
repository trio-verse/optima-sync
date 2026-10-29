import React, { use, Suspense } from "react";
import PdfPage from "../../../../../../components/PdfPage";

export default function Page({
  params,
}: {
  params: Promise<{ OrgId: string; projectId: number }>;
}) {
  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;
  const projectId = resolvedParams?.projectId;

  return (
    <Suspense
      fallback={<div className="text-center p-12">Loading quotation...</div>}
    >
      <PdfPage orgId={orgId} projectId={projectId} />
    </Suspense>
  );
}
