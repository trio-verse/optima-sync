// app/[OrgId]/dashboard/page.jsx
"use client"

import { use } from "react";
import { redirect } from "next/navigation";

export default function DashboardPage({ params }) {
  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;
  
  // ✅ التأكد من وجود orgId قبل التوجيه
  if (!orgId) {
    return <div>Loading...</div>; // أو يمكنك عرض رسالة خطأ
  }
  
  // ✅ التوجيه إلى صفحة Sales
  redirect(`/${orgId}/dashboard/sales`);
}