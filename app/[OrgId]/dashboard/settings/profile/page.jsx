"use client";

import { useState, useEffect, use } from "react";
import OrganisationForm from "@/components/OrganisationForm";
import LogoUploader from "@/components/LogoUploader";
import { getOrganisationById, getOrganisationLogo } from "@/actions/getActions";
import {
  updateOrganisationProfile,
  updateOrganisationLogo,
} from "@/actions/editOrgActions";

export default function EditProfilePage({ params }) {
  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;

  const [initialData, setInitialData] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const result = await getOrganisationById(orgId);

        if (result?.success && result?.data) {
          const payload = result.data.data || result.data;
          setInitialData({
            ...payload,
            name: payload?.name || "",
            email: payload?.email || "",
            phone_number: payload?.phone_number || payload?.phone || "",
            address: payload?.address || "",
            description: payload?.description || "",
          });

          const embeddedLogo = payload?.logo || payload?.image || payload?.logo_url;
          if (embeddedLogo) {
            setLogoUrl(embeddedLogo);
          } else {
            const logoResult = await getOrganisationLogo(orgId);
            if (logoResult?.success && logoResult?.logo_url) {
              setLogoUrl(logoResult.logo_url);
            }
          }
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
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await updateOrganisationProfile(orgId, formDataPayload);
      if (res?.success) {
        setSuccessMessage("Changes saved successfully!");
        if (res.data) {
          setInitialData((prev) => ({ ...prev, ...res.data }));
        }


        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res?.message || "Failed to update organisation details.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpdate = async (file) => {
    const res = await updateOrganisationLogo(orgId, file);
    if (res?.success && res.logo_url) {
      setLogoUrl(res.logo_url);
    }
    return res;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading organisation data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Header Banner */}
          <div 
            className="h-28 w-full relative" 
            style={{
              background: "linear-gradient(120deg, #1D4ED8 0%, #2563EB 55%, #38BDF8 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Logo Uploader */}
          <div className="flex justify-center -mt-12 mb-3">
            <div className="p-1 bg-white rounded-full shadow-md">
              <LogoUploader
                key={logoUrl}
                currentLogo={logoUrl}
                onUpload={handleLogoUpdate}
                showSkip={false}
                size={84}
              />
            </div>
          </div>

          {/* Form Content & Notification */}
          <div className="px-6 sm:px-8 pb-8 pt-2">


            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {successMessage}
              </div>
            )}


            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {errorMessage}
              </div>
            )}

            <OrganisationForm
              key={initialData?.id}
              initialValues={initialData || {}}
              onSubmit={handleUpdate}
              isEditing={true}
              loading={submitting}
              variant="embedded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}