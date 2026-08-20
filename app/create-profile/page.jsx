"use client";

import { useState ,use} from "react";
import { useRouter } from "next/navigation";
import OrganisationForm from "@/components/OrganisationForm";
import {
  createOrganisationProfile,
} from "@/actions/createNewOrganisation";


export default function CreateOrganisationPage({params}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const resolvedParams = params ? use(params) : null;
    const orgId = resolvedParams?.OrgId ;
  const handleCreateOrganisation = async (formDataPayload) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await createOrganisationProfile(formDataPayload);
  if (result?.success) {
      setSuccess("Organisation created successfully!");

      // 👈 تعديل: استخدام التوجيه بالـ redirectUrl المرتجع من الـ Action
      setTimeout(() => {
        router.push(result.redirectUrl || `{orgId}/upload-logo`);
      }, 1000);
    } else {
      console.error("BACKEND error", result?.message);
      // 👈 تعديل: عرض تفاصيل الأخطاء في حال وجود Validation Errors
      if (result?.errors) {
        console.log("Validation details:", result.errors);
      }
      setError(result?.message || "Failed to create organisation.");
    }
    setLoading(false);
  };

  return (
    <div>
      {success && (
        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-rose-100 text-rose-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      <OrganisationForm
        onSubmit={handleCreateOrganisation}
        isEditing={false}
        loading={loading}
      />
    </div>
  );
}
