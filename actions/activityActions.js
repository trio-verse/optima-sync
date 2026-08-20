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

// ============================================
// 📥 جلب النشاطات
// ============================================
export async function getActivities(connectionId, orgId) {
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

// ============================================
// ➕ إضافة نشاط
// ============================================
export async function createActivity(connectionId, content, orgId, clientId) {
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