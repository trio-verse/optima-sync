"use server";

import { api } from "@/lib/api/client";
import { cookies } from "next/headers";

export async function createProjectCost(projectId, orgId, costData) {
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
            `projects/${projectId}/costs`,
            {
                name: costData.name,
                description: costData.description,
                quantity: Number(costData.quantity) || 1,
                amount: Number(costData.amount),
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
        console.error("Error creating project cost:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function updateProjectCost(projectId, costId, orgId, costData) {
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
            `projects/${projectId}/costs/${costId}`,
            {
                name: costData.name,
                description: costData.description,
                quantity: Number(costData.quantity) || 1,
                amount: Number(costData.amount),
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
        console.error("Error updating project cost:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function deleteProjectCost(projectId, costId, orgId) {
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
            `projects/${projectId}/costs/${costId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting project cost:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}
export async function getProjectCosts(projectId, orgId) {
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
            `projects/${projectId}/costs`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );

        return response.data; // المرجّع سيكون { success: true, message: "...", data: [...] }
    } catch (error) {
        console.error("Error fetching project costs:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}