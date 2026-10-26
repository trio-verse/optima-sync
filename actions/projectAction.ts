"use server"
import { cookies } from "next/headers";
import {
    api
} from "@/lib/api/client";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/types/project";
export async function createProject(orgId:string, formData:CreateProjectInput):Promise<{ success: boolean; message?: string; data?: Project }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

if (!("clientId" in formData)) {
        return { success: false, message: "Please select a valid client." };
    }

    try {
        const response = await api.post(
            "/projects",
            {
                client_id: Number((formData as any).clientId),
                title: formData.title,
                description: formData.description,
                start_date: (formData as any).startDate,
                end_date:(formData as any).endDate,
                duration: formData.duration || undefined,
                sub_total: (formData as any).subTotal ? Number((formData as any).subTotal) : undefined,
                profit_percentage:(formData as any).profitPercentage? Number((formData as any).profitPercentage) : undefined,
                total_amount: (formData as any).totalAmount ? Number((formData as any).totalAmount) : undefined,
            },
            {
                token,
                headers: {
                    "X-Organization-ID": orgId,
                },
            }
        );
        return {
            success: true,
            data: response.data.data
        };
    } catch (error:any) {
        console.error("createProject validation error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to create project",
        };
    }
}

export async function updateProject(orgId:string, projectId:string, formData:UpdateProjectInput):Promise<{ success: boolean; message?: string; data?: Project }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return {
            success: false,
            message: "Unauthorized"
        };
    }

    if (!orgId) {
        return {
            success: false,
            message: "Organization ID is missing."
        };
    }
    try {
        const response = await api.patch(
            `/projects/${projectId}`,
            {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                start_date: (formData as any).startDate || undefined,
                end_date: (formData as any).endDate || undefined,
                duration: (formData as any).duration || undefined,
                sub_total: (formData as any).subTotal,
                profit_percentage: (formData as any).profitPercentage,
                total_amount: (formData as any).totalAmount,
                client_name: (formData as any).clientName,
                client_email: (formData as any).clientEmail
            },
            {
                token,
                headers: {
                    "X-Organization-ID": orgId,
                },
            }
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to update project"
        };
    }
}

export async function getProjects(orgId:string):Promise<{ success: boolean; message?: string; data?: Project[] }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return {
            success: false,
            message: "Unauthorized"
        };
    }

    if (!orgId) {
        return {
            success: false,
            message: "Organization ID is missing."
        };
    }

    try {
        const response = await api.get('/projects', {
            token,
            headers: {
                "X-Organization-ID": orgId,
            }
        });

        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to fetch projects"
        };
    }
}

export async function deleteProject(orgId:string, projectId:string):Promise<{ success: boolean; message?: string; data?: any }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return {
            success: false,
            message: "Unauthorized"
        };
    }

    if (!orgId) {
        return {
            success: false,
            message: "Organization ID is missing."
        };
    }
    try {
        const response = await api.delete(`/projects/${projectId}`, {
            token,
            headers: {
                "X-Organization-ID": orgId,
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Server error while deleting project"
        };
    }
}