"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";

export async function getMyOrganisations() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return {
                success: false,
                message: "Unauthorized",
                data: []
            };
        }

        const resdata = await api.get("/organizations/myOrgs", {
            token,
            cache: "no-store",
        });

        return {
            success: true,
            data: resdata?.data?.data || [],
        };
    } catch (error) {
        console.error("DEBUG getMyOrganisations Error:", error);
        return {
            success: false,
            message: error.data?.message ||
                error.message ||
                "Failed to fetch organisations.",
            data: [],
        };
    }
}