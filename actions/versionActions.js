"use server"
import { cookies } from "next/headers";
import { api } from "@/lib/api/client";

async function getAuthContext(orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { error: { success: false, message: "Unauthorized" } };
    }
    if (!orgId) {
        return { error: { success: false, message: "Organization ID is missing." } };
    }
    return { token };
}

export async function getVersions(projectId, orgId) {
    const { token, error } = await getAuthContext(orgId);
    if (error) return error;

    try {
        const response = await api.get(`/projects/${projectId}/versions`, {
            token,
            headers: { "X-Organization-ID": orgId },
        });
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to fetch versions",
        };
    }
}

export async function getVersionById(projectId, versionId, orgId) {
    const { token, error } = await getAuthContext(orgId);
    if (error) return error;

    try {
        const response = await api.get(`/projects/${projectId}/versions/${versionId}`, {
            token,
            headers: { "X-Organization-ID": orgId },
        });
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to fetch version",
        };
    }
}

export async function updateVersion(projectId, versionId, orgId, formData) {
    const { token, error } = await getAuthContext(orgId);
    if (error) return error;

    try {
        const response = await api.patch(
            `/projects/${projectId}/versions/${versionId}`,
            {
                title: formData.title,
                description: formData.description,
                change_description: formData.changeDescription,
            },
            {
                token,
                headers: { "X-Organization-ID": orgId },
            }
        );
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to update version",
        };
    }
}

export async function freezeVersion(projectId, versionId, orgId) {
    const { token, error } = await getAuthContext(orgId);
    if (error) return error;

    try {
        const response = await api.patch(
            `/projects/${projectId}/versions/${versionId}/freeze`,
            {},
            {
                token,
                headers: { "X-Organization-ID": orgId },
            }
        );
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to freeze version",
        };
    }
}

export async function deleteVersion(projectId, versionId, orgId) {
    const { token, error } = await getAuthContext(orgId);
    if (error) return error;

    try {
        const response = await api.delete(`/projects/${projectId}/versions/${versionId}`, {
            token,
            headers: { "X-Organization-ID": orgId },
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to delete version",
        };
    }
}