"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrganisationForm from "../components/OrganisationForm";
import { createOrganisationProfile ,uploadInitialLogo} from "../actions/createNewOrganisation";
import Cookies from "js-cookie";
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

        if (result?.success) {

            setSuccess("Organisation created successfully!");

            setTimeout(() => {
                router.push("/upload-logo");
            }, 1500);
        } else {
            console.error("BACKEND error",result.message)
            //setError(result.message || "Failed to create organaisation.");
        }
        setLoading(false);
    };

    return (
        <div>
            {success && <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg mb-4">{success}</div>}
            {error && <div className="p-3 bg-rose-100 text-rose-700 rounded-lg mb-4">{error}</div>}

            <OrganisationForm 
                onSubmit={handleCreateOrganisation}
                isEditing={false} 
                loading={loading} 
            />
        </div>
    );
}