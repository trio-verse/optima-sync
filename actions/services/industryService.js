"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * جلب قائمة المجالات (Industries)
 */
export async function getIndustry() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/industries", {
      token,
      orgId,
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data || [],
    };
  } catch (error) {
    console.error("DEBUG getIndustry Error:", error);
    return {
      success: false,
      message:
        error.data?.message || error.message || "Failed to fetch industries",
      data: [],
    };
  }
}

/**
 * إنشاء مجال جديد
 */
export async function createIndustry(newName, newColor) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.post("/industries", payload, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
      id: resdata?.data?.id,
    };
  } catch (error) {
    console.error("DEBUG createIndustry Error:", error);
    return {
      success: false,
      message:
        error.data?.message || error.message || "Failed to create industry",
    };
  }
}

// التوافقية مع الاسم السابق في حال استخدامه بأماكن أخرى
export const creatIndustry = createIndustry;

/**
 * تحديث بيانات مجال
 */
export async function updateIndustry(id, newName, newColor) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.patch(`/industries/${id}`, payload, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateIndustry Error:", error);
    return {
      success: false,
      message:
        error.data?.message || error.message || "Failed to update industry",
    };
  }
}

/**
 * حذف مجال
 */
export async function deleteIndustry(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/industries/${id}`, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteIndustry Error:", error);
    return {
      success: false,
      message:
        error.data?.message || error.message || "Failed to delete industry",
    };
  }
}
