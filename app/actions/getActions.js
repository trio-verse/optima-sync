"use server";

import { cookies } from "next/headers";
export async function getOrganisationById(organisationId) {
    try {
        const cookieStore=await cookies();
        const token =cookieStore.get("token")?.value;
        const targetOrgId=organisationId || cookieStore.get("organaisationId")?.value;
        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/${targetOrgId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            cache: "no-store", 
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to fetch organisation details.",
            };
        }

        return {
            success: true,
            data: resdata.data,
            
        };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while fetching organisation details.",
        };
    }
}

export async function getOrganisationLogo(organisationId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const targetOrgId = organisationId || cookieStore.get("organaisationId")?.value;

        if (!targetOrgId) return { success: false, message: "No ID found." };

        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/${targetOrgId}/logo`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
        },
            cache: "no-store",
        });

        const resdata = await response.json();

        if (!response.ok) {
            return { success: false, mesAsage: "Failed to fetch logo." };
        }

        return {
            success: true,
            logo_url: resdata?.data?.logo_url || resdata?.logo_url,
        };
    } catch (error) {
        return { success: false, message: "An error occurred." };
    }
}