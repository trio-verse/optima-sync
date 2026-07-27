"use client";
import { useEffect ,useState} from "react";
import LogoUploader from "@/app/components/LogoUploader";
import { updateOrganisationLogo } from "@/app/actions/editOrgActions";
import { useSearchParams } from "next/navigation";
import { getOrganisationLogo } from "@/app/actions/getActions";

export default function EditProfilePage() {
    const searchParams=useSearchParams();
    const [initialData,setInitialData]=useState(null);
    const [loading,setLoading]=useState(false);

    const orgId=searchParams.get("id");
    const handleLogoUpdate = async (file) => {
        return await updateOrganisationLogo(null, file); 
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getOrganisationLogo(orgId);
                if (result?.success) {
                    setInitialData(result.data);
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
                    onUpload={handleLogoUpdate}

                    showSkip={false} 
                />
            </div>
            
        </div>
    );
}