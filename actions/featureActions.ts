"use server";

import { api } from "@/lib/api/client";
import { cookies } from "next/headers";

import type {
    ProjectFeature,
    CreateFeatureInput,
    UpdateFeatureInput,
    FeatureStatus
} from "@/types/project";

export async function getProjectFeatures(projectId:number, orgId:string): Promise<{ success: boolean; message?: string; data?: ProjectFeature[] }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

    try {
        const response = await api.get(
            `projects/${projectId}/features`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching project features:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function createProjectFeature(projectId:number, orgId:string, featureData: CreateFeatureInput): Promise<{ success: boolean; message?: string; data?: ProjectFeature }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

    try {
        const response = await api.post(
            `projects/${projectId}/features`,
            {
                name: featureData.name,
                description: featureData.description,
                status: featureData.status || "new", // "new" | "in_progress" | "completed"
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creating project feature:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}

export async function updateProjectFeature(projectId:number, featureId:number, orgId:string, featureData: UpdateFeatureInput): Promise<{ success: boolean; message?: string; data?: ProjectFeature }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

    try {
        const response = await api.patch(
            `projects/${projectId}/features/${featureId}`,
            {
                name: featureData.name,
                description: featureData.description,
                status: featureData.status,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating project feature:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function deleteProjectFeature(projectId:number, featureId:number, orgId:string): Promise<{ success: boolean; message?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

    try {
        const response = await api.delete(
            `projects/${projectId}/features/${featureId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting project feature:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}
export async function updateProjectFeatureStatus(projectId:number, featureId:number, orgId:string, status: FeatureStatus): Promise<{ success: boolean; message?: string; data?: ProjectFeature }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

    try {
        const response = await api.patch(
            `projects/${projectId}/features/${featureId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating project feature status:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}