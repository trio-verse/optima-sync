// app/clients/create/page.jsx
"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import { createClient } from "@/actions/clientActions";

export default function CreateClientPage({ params }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const resolvedParams = params ? use(params) : null;            
  const orgId = resolvedParams?.OrgId;      

  const handleCreate = async (formDataPayload, { actionType, resetForm }) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await createClient(formDataPayload, orgId);

      if (res?.success) {
        if (actionType === "add_another") {
          resetForm();
          setIsSubmitting(false);
        } else {
          const newClientId = res?.data?.id || res?.id;
          if (newClientId) {
            router.push(`/${orgId}/dashboard/clients/${newClientId}`);
          } else {
            router.push(`/${orgId}/dashboard/clients`);
          }
        }
      } else {
        setErrorMsg(res?.message || "An error occurred while adding the client");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg("An unexpected error occurred while connecting to the server.");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back(); 
  };

  return (
    <div className="p-6">
      {errorMsg && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}
      <ClientForm
        onSubmit={handleCreate}
        onClose={handleClose} 
        isSubmitting={isSubmitting}
        orgId={orgId}
      />
    </div>
  );
}