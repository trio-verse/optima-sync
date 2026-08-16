// app/clients/create/page.jsx
"use client";

import { useState ,use} from "react";
import { useRouter } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import { createClient } from "@/actions/clientActions";

export default function CreateClientPage({params}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const resolvedParams = params ? use(params) : null;            
  const orgId = resolvedParams?.OrgId;      

  const handleCreate = async (formDataPayload) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await createClient(formDataPayload,orgId);

      if (res?.success) {
      router.push(`/${orgId}/dashboard/clients`); 
        // router.refresh();
      } else {
        setErrorMsg(res?.message || "حدث خطأ أثناء إضافة العميل");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg("حدث خطأ غير متوقع أثناء الاتصال بالخادم.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {errorMsg && (
        <div className="max-w-2xl mx-auto mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}
      <ClientForm onSubmit={handleCreate} isSubmitting={isSubmitting} orgId={orgId}  />
    </div>
  );
}
