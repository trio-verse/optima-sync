"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateOrganisationProfile(organisationId, formDataPayload) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const cookieOrgId = 
            cookieStore.get("organaizationId")?.value || 
            cookieStore.get("organizationId")?.value;
            
        const rawOrgId = (organisationId && organisationId !== "null") ? organisationId : cookieOrgId;
        const targetOrgId = rawOrgId ? String(rawOrgId).trim() : null;

        if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
            return {
                success: false,
                message: "No Organisation ID provided.",
            };
        }


const payloadToSend = {
            name: String(formDataPayload.name || "").trim(),
            email: String(formDataPayload.email || "").trim(),
            phone_number: String(formDataPayload.phone_number || formDataPayload.phone || "").trim(),
            address: String(formDataPayload.address || "").trim(),
            description: String(formDataPayload.description || "").trim(),
        };
        console.log(targetOrgId)
        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/${targetOrgId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payloadToSend),
        });

        const resdata = await response.json();
        console.log(resdata);
        if (!response.ok) {
            return {
                success: false,
                message: resdata?.data?.message || resdata?.message || "Failed to update organisation profile.",
            };
        }
        console.log(response);
        revalidatePath(`/dashboard/settings/profile`);

        return {
            success: true,
            data: resdata?.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while updating the profile.",
        };
    }
}

export async function updateOrganisationLogo(organisationId, imageFile) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return {
                success: false,
                message: "Unauthorized. Token not found.",
            };
        } 

        const targetOrgId = organisationId || cookieStore.get("organaizationId")?.value || cookieStore.get("organizationId")?.value;
        if (!targetOrgId) {
            return {
                success: false,
                message: "No Organisation ID found.",
            };
        }

        const formData = new FormData();
        formData.append("logo", imageFile);

        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/${targetOrgId}/logo`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const resdata = await response.json();

        console.log("=== UPDATE LOGO RESPONSE ===", resdata); 
        if (!response.ok) {
            return {
                success: false,
                message: resdata?.errors ? JSON.stringify(resdata.errors) : (resdata?.message || "Failed to update logo."),
            };
        }

        revalidatePath(`/dashboard/settings/profile`);

        return {
            success: true,
            logo_url: resdata?.data?.logo_url || resdata?.logo_url,
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while updating the logo.",
        };
    }
}