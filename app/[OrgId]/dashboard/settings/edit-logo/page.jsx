"use client";
import { useEffect, useState ,use} from "react";
import LogoUploader from "@/components/LogoUploader";
import { updateOrganisationLogo } from "@/actions/editOrgActions";

import { getOrganisationLogo } from "@/actions/getActions";

export default function EditProfilePage({params}) {

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId ;

  const handleLogoUpdate = async (file) => {
    return await updateOrganisationLogo(orgId, file);
  };

  useEffect(() => {
    if (!orgId) {

      setLoading(false);
      return;
    }
    async function fetchData() {

      try {
        setLoading(true);
        const result = await getOrganisationLogo(orgId);
        console.log("FETCHED LOGO RESULT:", result);
        if (result?.success) {
          setInitialData({ logo_url: result.logo_url });
        } else {
          console.error("Backend Error:", result?.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orgId]);

  return (
    <div className="max-w-xl bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
        Organisation Settings
      </h2>

      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
        <h3 className="text-xs font-semibold text-zinc-700 mb-4 text-center">
          Update Logo
        </h3>

        <LogoUploader
          key={initialData?.logo_url}
          currentLogo={initialData?.logo_url}
          onUpload={handleLogoUpdate}
          showSkip={false}
        />

      </div>
    </div>
  );
}

