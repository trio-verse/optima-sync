"use client";
import { useEffect ,useState ,Suspense} from "react";
import LogoUploader from "@/app/components/LogoUploader";
import { updateOrganisationLogo } from "@/app/actions/editOrgActions";
import { useSearchParams } from "next/navigation";
import { getOrganisationLogo } from "@/app/actions/getActions";

    function EditProfileContent() {
    const searchParams=useSearchParams();
    const [initialData,setInitialData]=useState(null);
    const [loading,setLoading]=useState(false);

    const orgId=searchParams.get("id");
    const handleLogoUpdate = async (file) => {
        return await updateOrganisationLogo(orgId, file); 
    };

    useEffect(() => {
        async function fetchData() {
            if(!orgId){
                setLoading(false)
                return;
            }
            try {
                const result = await getOrganisationLogo(orgId);
                if (result?.success) {
                    setInitialData({logo_url:result.logo_url});

                    
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
                currentLogo={initialData?.logo_url}
                    onUpload={handleLogoUpdate}
                    
                    showSkip={false} 
                />
            </div>
            
        </div>
    );
}
export default function EditProfilePag(){
    return(
        <Suspense fallback={<div>Loading page...</div>}>
            <EditProfileContent />
        </Suspense>
    )
}