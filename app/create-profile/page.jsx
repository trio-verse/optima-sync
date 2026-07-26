"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrganisationForm from "../components/OrganisationForm";
import { createOrganisationProfile ,uploadInitialLogo} from "../actions/createNewOrganisation";

export default function CreateOrganisationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreateOrganisation = async (formDataPayload) => {
        setLoading(true);
        setError("");
        setSuccess("");

        const result = await createOrganisationProfile(formDataPayload);

        if (result.success) {
            const newOrgId=result.data?.id
            setSuccess("Organisation created successfully!");
            if(newOrgId){
                localStorage.setItem("organaisationId",newOrgId)
            }
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div>
            {success && <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg mb-4">{success}</div>}
            {error && <div className="p-3 bg-rose-100 text-rose-700 rounded-lg mb-4">{error}</div>}

            <OrganisationForm 
                onSubmit={handleCreateOrganisation}
                onImageUpload={(file)=>uploadInitialLogo(file)}
                isEditing={false} 
                loading={loading} 
            />
        </div>
    );
}