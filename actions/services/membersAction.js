"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * جلب أعضاء المنظمة
 */
export async function getMembers(orgId) {
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

    const resdata = await api.get(`/organizations/${orgId}`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    const orgData = resdata?.data?.data || resdata?.data;
    return {
      success: true,
      data: orgData?.members || [],
    };
  } catch (error) {
    console.error("DEBUG getMembers Error:", error.cause);
    console.error("DEBUG getMembers Error",error.message)
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to fetch members",
      data: [],
    };
  }
}

/**
 * إضافة عضو جديد
 */
export async function createMember(formData,orgId) {
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
      data: resdata?.data?.data ,
    };
  } catch (error) {
    console.error("DEBUG createMember Error:", error.cause);
    console.error("DEBUG createMember Error:", error.message)
    console.error("DEBUG createMember FULL DATA:", JSON.stringify(error.data, null, 2)); // 👈 ضيفي هاد السطر
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

/**
 * تحديث دور عضو
 */
export async function updateMember(memberId, { role },orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
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
      success: resdata?.success ?? true,
      message: resdata?.message || "Role updated successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateMember Error:", error.cause);
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

/**
 * حذف عضو
 */
export async function deleteMember(memberId,orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
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
      data: resdata?.data?.data,
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