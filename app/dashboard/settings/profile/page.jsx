"use client";

import OrganisationForm from "@/app/components/OrganisationForm";
import { getOrganisationById } from "@/app/actions/getActions";
import { updateOrganisationProfile ,updateOrganisationLogo } from "@/app/actions/editOrgActions";
import { useState ,useEffect,Suspense} from "react";
import { useSearchParams } from "next/navigation";

function EditProfileContent() {
    const searchParams=useSearchParams();
    const orgId=searchParams.get("id");
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        async function fetchData() {
            try{
            const result = await getOrganisationById(orgId);
            if (result?.success) {

                setInitialData(result.data);
            }else{
                console.error("backend error",result?.message)
            }
            }catch(error){
                console.error("Network or unexpected error",error);
            }finally{
            setLoading(false);
            }
        }
        fetchData();
    }, [orgId]);

    const handleUpdate = async (formDataPayload) => {
        await updateOrganisationProfile(orgId, formDataPayload);
    };

    if (loading) return <div>Loading organisation data...</div>;

    return (
        <OrganisationForm 
            key={initialData?.id}
            initialValues={initialData?.data}
            onSubmit={handleUpdate}
            onImageUpload={(file) => updateOrganisationLogo(orgId, file)}
            isEditing={true}
        />
    );
}

export default function EditProfilePage() {
    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <EditProfileContent />
        </Suspense>
    );
}