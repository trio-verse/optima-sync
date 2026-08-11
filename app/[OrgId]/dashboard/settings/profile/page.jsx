"use client";

import OrganisationForm from "@/components/OrganisationForm";
import { getOrganisationById } from "@/actions/getActions";
import {
  updateOrganisationProfile,
  updateOrganisationLogo,
} from "@/actions/editOrgActions";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EditProfileContent() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("id");

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getOrganisationById(orgId);
        if (result?.success) {
          const payload = result?.data;
          const sanitizedData = {
            ...payload,
            name: payload?.name || "",
            email: payload?.email || "",
            phone: payload?.phone_number || payload?.phone || "",
            phone: payload?.phone_number || payload?.phone || "",
            address: payload?.address || "",
            description: payload?.description || "",
          };

          setInitialData(sanitizedData);
        } else {
          console.error("Backend error:", result?.message);
        }
      } catch (error) {
        console.error("Network or unexpected error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orgId]);

  const handleUpdate = async (formDataPayload) => {
    setSubmitting(true);
    try {
      const res = await updateOrganisationProfile(orgId, formDataPayload);

      if (res?.success) {
        alert("Organisation updated successfully!");

        if (res.data) {
          setInitialData((prev) => ({ ...prev, ...res.data }));
        }
      } else {
        alert(res?.message || "Failed to update organisation.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpload = async (file) => {
    try {
      const res = await updateOrganisationLogo(orgId, file);
      if (res?.success) {
        alert("Logo updated successfully!");
        console.log(res.data);
        if (res.logo_url) {
          setInitialData((prev) => ({
            ...prev,
            logo_url: res.logo_url,
            logo: res.logo_url,
          }));
        }
      } else {
        alert(res?.message || "Failed to upload logo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading logo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-zinc-600 font-medium animate-pulse">
          Loading organisation data...
        </div>
      </div>
    );
  }

  return (
    <OrganisationForm
      key={initialData?.id}
      initialValues={initialData || {}}
      onSubmit={handleUpdate}
      onImageUpload={handleLogoUpload}
      isEditing={true}
      loading={submitting}
    />
  );
}

export default function EditProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center text-zinc-600 font-medium">
            Loading page...
          </div>
        </div>
      }
    >
      <EditProfileContent />
    </Suspense>
  );
}
