"use server";

import { cookies } from "next/headers";

export async function getOrganisationById(organisationId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const targetOrgId = organisationId || cookieStore.get("organaizationId")?.value;

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
                message: resdata?.message || "Failed to fetch organisation details.",
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
        const cookieOrgId = cookieStore.get("organaizationId")?.value || cookieStore.get("organizationId")?.value;
        const targetOrgId = (organisationId && organisationId !== "null") ? organisationId : cookieOrgId;

        if (!targetOrgId) return { success: false, message: "No ID found." };

        const response = await fetch(`https://optima.trio-verse.com/api/v1/organizations/${targetOrgId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: "no-store",
        });

        const resdata = await response.json();


        console.log("=== GET ORG DATA ===", resdata);

        if (!response.ok) {
            return { success: false, message: resdata?.message || "Failed to fetch logo." };
        }

        const orgData = resdata?.data || resdata;

        const rawLogo = orgData?.logo_url || orgData?.logo || orgData?.logo_path || null;

        if (!rawLogo) {

            return {
                success: true,
                message: "No logo set yet",
                logo_url: null,
            };
        }

        const fullLogoUrl = rawLogo.startsWith("/")
            ? `https://optima.trio-verse.com${rawLogo}`
            : rawLogo;

        return {
            success: true,
            message: "Logo fetched successfully",
            logo_url: fullLogoUrl,
        };

    } catch (error) {
        console.error("Error in getOrganisationLogo:", error);
        return { success: false, message: error?.message || "An error occurred." };
    }
}