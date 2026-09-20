"use server"
import { cookies } from "next/headers";
import {
    api
} from "@/lib/api/client";

export async function createProject(orgId, formData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }

    if (!formData.clientId) {
        return { success: false, message: "Please select a valid client." };
    }

    try {
        const response = await api.post(
            "/projects",
            {
                client_id: Number(formData.clientId),
                title: formData.title,
                description: formData.description,
                start_date: formData.startDate || undefined,
                end_date: formData.endDate || undefined,
                duration: formData.duration || undefined,
                sub_total: formData.subTotal ? Number(formData.subTotal) : undefined,
                profit_percentage: formData.profitPercentage ? Number(formData.profitPercentage) : undefined,
                total_amount: formData.totalAmount ? Number(formData.totalAmount) : undefined,
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
        console.error("createProject validation error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to create project",
            errors: error.response?.data?.errors || error.data?.errors || null,
        };
    }
}

export async function updateProject(orgId, projectId, formData) {
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
                start_date: formData.startDate || undefined,
                end_date: formData.endDate || undefined,
                duration: formData.duration || undefined,
                sub_total: formData.subTotal,
                profit_percentage: formData.profitPercentage,
                total_amount: formData.totalAmount,
                client_name: formData.clientName,
                client_email: formData.clientEmail
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

export async function getProjects(orgId) {
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

export async function deleteProject(orgId, projectId) {
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