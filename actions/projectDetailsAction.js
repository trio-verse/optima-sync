"use server"
import { cookies } from "next/headers";
import {
    api
} from "@/lib/api/client";

export async function getProjectById(orgId, projectId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return {
            success: false,
            message: "Unauthorized",
        };
    }

    if (!orgId) {
        return {
            success: false,
            message: "Organization ID is missing.",
        };
    }

    if (!projectId) {
        return {
            success: false,
            message: "Project ID is missing.",
        };
    }

    try {
        const response = await api.get(`/projects/${projectId}`, {
            token,
            headers: {
                "X-Organization-ID": orgId,
            },
        });
        console.log("FULL BACKEND RESPONSE:", JSON.stringify(response, null, 2));
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        console.error("getProjectById error:", error.response?.data);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                error.data?.message ||
                "Failed to fetch project details",
        };
    }
}