"use server";
import { cookies } from "next/headers";

export async function updateOrganisationProfile(organisationId, formDataPayload) {
    try {
            console.log(formDataPayload)

        const cookieStore=await cookies();
        const token=cookieStore.get("token")?.value;
        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/architecto${organisationId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify({formDataPayload}),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to update organisation profile.",
            };
        }

        return {
            success: true,
            data: data,
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
        const formData = new FormData();
        formData.append("logo", imageFile);

        const response = await fetch("", {
            method: "POST",
            body: formData,
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata.data.message || "Failed to update logo.",
            };
        }

        return {
            success: true,
            logo: resdata.data.logo,
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while updating the logo.",
        };
    }
}