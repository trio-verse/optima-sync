// actions/activityActions.js
"use server";

import {
    cookies
} from "next/headers";
import {
    revalidatePath
} from "next/cache";
import {
    api
} from "@/lib/api/client";
import { Activity } from "@/types/Connection";
import { PaginationMeta } from "@/types/api";

export async function getActivities(connectionId: number, orgId?: string): Promise<{ success: boolean; message: string; data: Activity[] ; meta?: PaginationMeta }> {
    try {
        if (!connectionId || !orgId) {
            return {
                success: false,
                message: "Connection ID and Organization ID are required",
                data: []
            };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return {
            success: false,
            message: "Unauthorized",
            data: []
        };

        const resdata = await api.get(`/connections/${connectionId}/activities`, {
            token,
            headers: {
                "X-Organization-ID": orgId
            },
            cache: "no-store",
        });

        return {
            success: true,
            message: resdata?.data?.message || "Activities fetched successfully",
            data: resdata?.data?.data || [],
            meta: resdata?.data?.meta || {},
        };
    } catch (error) {
        console.error("DEBUG getActivities Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to fetch activities",
            data: [],
        };
    }
}

export async function createActivity(connectionId:number, content: string, orgId?: string, clientId?: string): Promise<{ success: boolean; message: string; data?: Activity ; errors?: Record<string, string[] | string> }> {
    try {
        if (!connectionId || !orgId) {
            return {
                success: false,
                message: "Connection ID and Organization ID are required"
            };
        }

        if (!content || content.trim() === "") {
            return {
                success: false,
                message: "Activity content is required"
            };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return {
            success: false,
            message: "Unauthorized"
        };

        const body = {
            content: content.trim(),
        };

        const resdata = await api.post(`/connections/${connectionId}/activities`, body, {
            token,
            headers: {
                "X-Organization-ID": orgId
            },
        });

        if (clientId) {
            revalidatePath(`/${orgId}/dashboard/clients/${clientId}`);
        }
        revalidatePath(`/${orgId}/dashboard/sales`);

        return {
            success: true,
            data: resdata?.data?.data,
            message: resdata?.data?.message || "Activity added successfully",
        };
    } catch (error) {
        console.error("DEBUG createActivity Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to add activity",
            errors: error.data?.errors || null,
        };
    }
}

export async function updateActivity(connectionId: number, activityId: number, content: string, orgId?: string, clientId?: string): Promise<{ success: boolean; message: string; data?: Activity ; errors: Record<string, string[] | string> }> {
    try {
        if (!connectionId || !activityId || !orgId) {
            return { success: false, message: "Missing required IDs", errors: {} };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { success: false, message: "Unauthorized", errors: {} };

        const resdata = await api.patch(`/connections/${connectionId}/activities/${activityId}`, 
            { content: content.trim() }, 
            {
                token,
                headers: { "X-Organization-ID": orgId },
            }
        );

        if (clientId) revalidatePath(`/${orgId}/dashboard/clients/${clientId}`);

        return {
            success: true,
            data: resdata?.data?.data,
            message: "Activity updated successfully",
            errors: {},
        };
    } catch (error) {
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to update activity",
            errors: error.data?.errors || {},
        };
    }
}
export async function deleteActivity(connectionId: number, activityId: number, orgId?: string, clientId?: string): Promise<{ success: boolean; message: string}> {
    try {
        if (!connectionId || !activityId || !orgId) {
            return { success: false, message: "Missing required IDs" };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { success: false, message: "Unauthorized" };

        await api.delete(`/connections/${connectionId}/activities/${activityId}`, {
            token,
            headers: { "X-Organization-ID": orgId },
        });

        if (clientId) revalidatePath(`/${orgId}/dashboard/clients/${clientId}`);

        return {
            success: true,
            message: "Activity deleted successfully",
        };
    } catch (error) {
        console.error("DEBUG deleteActivity Error:", error.cause);
        
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to delete activity",
        };
    }
}