"use server";
import { cookies } from "next/headers";

export async function createOrganisationProfile(formDataPayload) {
    try {
        const cookieStore=await cookies();
        const token=cookieStore.get("token")?.value;
        const response = await fetch("https://optima.trio-verse.com/api/v1/organizations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formDataPayload),
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to create organisation profile.",
            };
        }
        const newOrgId=resdata.data.id;
        if(newOrgId){
            cookieStore.set("organaisationId",newOrgId , {
                path:"/",
                maxAge: 60*60*24*7,
                sameSite:"lax"
            })
        }

        return {
            success: true,
            data: resdata.data,
            id:resdata.data.id
        };
    } catch (error) {
        console.error("DEBUG Server Action Error",error)
        return {
            success: false,
            message: "An error occurred while connecting to the server.",
        };
    }
}

export async function uploadInitialLogo(imageFile) {
    try {
        const cookieStore=await cookies();
        const token=cookieStore.get("token")?.value;

        const formData = new FormData();
        formData.append("logo_url", imageFile);
        const orgId=cookieStore.get("organaisationId")?.value;
        if(!orgId){
            return{
                success:false,  
                message:"Organaisation ID not found"
            }
        }
        const response = await fetch(`http://localhost:8000/api/v1/organizations/${orgId}/logo`, {
            method: "POST",
            headers:{
            Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata.data.message || "Failed to upload logo.",
            };
        }

        return {
            success: true,
            logo_url: resdata.data.logo_url,
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while uploading the logo.",
        };
    }
}