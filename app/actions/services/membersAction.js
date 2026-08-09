"use server";

import { cookies } from "next/headers";

const BASE_URL = "https://optima.trio-verse.com/api/v1";

async function getAuthContext() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";
    const orgId = cookieStore.get("organizationId")?.value;
    console.log("Current Org ID from cookie:", orgId);
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    return {
        headers,
        orgId
    };
}

export async function getMembers() {
    try {
        const { headers, orgId } = await getAuthContext();

        if (!orgId) {
            return {
                success: false,
                message: "Organization ID is missing"
            };
        }

        const response = await fetch(`${BASE_URL}/organizations/${orgId}`, {
            method: "GET",
            headers,
            cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to fetch members"
            };
        }

        return {
            success: true,
            data:result.data?.members || []
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

export async function createMember(formData) {
    try {
        const { headers, orgId } = await getAuthContext();

        if (!orgId) {
            return {
                success: false,
                message: "Organization ID is missing"
            };
        }

        // 🟢 التعديل الرئيسي هنا: إرسال الإيميل مباشرة بدلاً من user_id
        const payload = {
            email: formData.email,
            role: formData.role,
        };

        const response = await fetch(`${BASE_URL}/organizations/${orgId}/members`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to add member"
            };
        }

        return {
            success: true,
            data: result.data || result
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

export async function updateMember(memberId, { role }) {
    try {
        const { headers, orgId } = await getAuthContext();

        if (!orgId) {
            return {
                success: false,
                message: "Organization ID is missing"
            };
        }

        const response = await fetch(`${BASE_URL}/organizations/${orgId}/members/${memberId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ role }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to update member role"
            };
        }

        return {
            success: true,
            data: result.data || result
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

export async function deleteMember(memberId) {
    try {
        const { headers, orgId } = await getAuthContext();

        if (!orgId) {
            return {
                success: false,
                message: "Organization ID is missing"
            };
        }

        const response = await fetch(`${BASE_URL}/organizations/${orgId}/members/${memberId}`, {
            method: "DELETE",
            headers,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to delete member"
            };
        }

        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}