"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";
import { revalidatePath } from "next/cache";


export async function createWorkspaceMember(
  orgId: string,
  workspaceId: string | number,
  formData: { memberId: string | number }
): Promise<{ success: boolean; message?: string; data?: any; errors?: Record<string, string[] | string> }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    if (!workspaceId) {
      return { success: false, message: "Workspace ID is missing" };
    }

    const payload = {
      member_id: Number(formData.memberId),
    };

    console.log("ADD WORKSPACE MEMBER - orgId:", orgId, "workspaceId:", workspaceId, "payload:", payload);
    
    const resdata = await api.post(`/workspaces/${workspaceId}/members`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath(`/dashboard/workspace/${workspaceId}`);

    return {
      success: true,
      message: resdata?.data?.message,
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error: any) {
    console.error("DEBUG addWorkspaceMember Error:", error.cause);
    console.error("DEBUG addWorkspaceMember Error:", error.message);
    console.error("DEBUG addWorkspaceMember FULL DATA:", JSON.stringify(error.data, null, 2));
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to add member to workspace",
      errors: error.data?.errors || null,
    };
  }
}

export async function deleteWorkspaceMember(
  orgId: string,
  workspaceId: string | number,
  memberId: string | number
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    if (!workspaceId || !memberId) {
      return { success: false, message: "Workspace ID or Member ID is missing" };
    }

    console.log("DELETE WORKSPACE MEMBER - orgId:", orgId, "workspaceId:", workspaceId, "memberId:", memberId);

    const resdata = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath(`/dashboard/workspace/${workspaceId}`);

    return {
      success: true,
      message: resdata?.data?.message,
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error: any) {
    console.error("DEBUG deleteWorkspaceMember Error:", error.cause);
    console.error("DEBUG deleteWorkspaceMember Error:", error.message);
    console.error("DEBUG deleteWorkspaceMember FULL DATA:", JSON.stringify(error.data, null, 2));
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to remove member from workspace",
    };
  }
}