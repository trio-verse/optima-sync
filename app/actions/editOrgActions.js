"use server";
import { cookies } from "next/headers";

export async function updateOrganisationProfile(organisationId, formDataPayload) {
    try {


        const cookieStore=await cookies();
        const token=cookieStore.get("token")?.value;

        const targetOrgId=organisationId;
        if(!targetOrgId){
            return{
                success:false,
                message:"No Organaisation ID provided or found in cookies."
            }
        }
        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/${targetOrgId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify(formDataPayload),
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata.data.message || "Failed to update organisation profile.",
            };
        }

        return {
            success: true,
            data: resdata.data,
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
        const cookieStore=await cookies();
        const token=cookieStore.get("token")?.value;
        const targetOrgId=organisationId || cookieStore.get("organaisationId")?.value;
        if(!targetOrgId){
            return{
                success:false,
                message:"No Organaisation ID found in cookies"
            }
        }
        const formData = new FormData();
        formData.append("logo_url", imageFile);

        const response = await fetch(`${targetOrgId}`, {
            method: "POST",
            headers:{
                Authorization:`Bearer ${token}`
            },
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
            logo_url: resdata.data.logo_url,
        };
        } catch (error) {
        return {
            success: false,
            message: "An error occurred while updating the logo.",
        };
    }
}