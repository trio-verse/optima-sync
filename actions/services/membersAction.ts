"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";
import { MemberRole, OrgMember, OrgMemberRequest } from "@/types/organization";


export async function getMembers(orgId:string): Promise<{ success: boolean; message?: string; data: OrgMember[] }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing",
        data: [],
      };
    }

    const resdata = await api.get(`/organizations/${orgId}/members`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
     return {
            success: true,
            data: resdata?.data?.data || [],
        };
    } catch (error) {
        console.error("DEBUG getProducts Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to fetch products",
            data: [],
        };
    }
}


export async function createMember(formData: OrgMemberRequest, orgId: string): Promise<{ success: boolean; message: string; data?: any; errors?: Record<string, string[] | string> }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    const payload = {
      email: formData.email,
      role: formData.role,
    };
    console.log("CREATE MEMBER - orgId:", orgId, "payload:", payload);
    const resdata = await api.post(`/organizations/${orgId}/members`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/members");

    return {
      success: true,
      message: resdata?.data?.message ,
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG createMember Error:", error.cause);
    console.error("DEBUG createMember Error:", error.message);
    console.error("DEBUG createMember FULL DATA:", JSON.stringify(error.data, null, 2));
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to add member",
      errors: error.data?.errors || null,
    };
  }
}


export async function updateMember(memberId: string, { role }: { role: MemberRole }, orgId: string): Promise<{ success: boolean; message: string; data?: any; errors?: Record<string, string[] | string> }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    if (!memberId) {
      return { success: false, message: "Member ID is missing" };
    }

    const resdata = await api.patch(
      `/organizations/${orgId}/members/${memberId}`,
      { role },
      { 
        token,
        headers: { "X-Organization-ID": orgId } 
      }
    );

    revalidatePath("/dashboard/members");

    return {
      success: resdata?.data?.success ?? true,
      message: resdata?.data?.message || "Role updated successfully",
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateMember Error:", error.cause || error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to update member role",
      errors: error.data?.errors || null,
    };
  }
}


export async function deleteMember(memberId, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    if (!memberId) {
      return { success: false, message: "Member ID is missing" };
    }

    const resdata = await api.delete(
      `/organizations/${orgId}/members/${memberId}`,
      { 
        token, 
        headers: { "X-Organization-ID": orgId } 
      }
    );

    revalidatePath("/dashboard/members");

    return {
      success: true,
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteMember Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to delete member",
    };
  }
}