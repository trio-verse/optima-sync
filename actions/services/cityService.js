"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * جلب قائمة المدن
 */
export async function getCity() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/cities", {
      token,
      orgId,
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data || [],
    };
  } catch (error) {
    console.error("DEBUG getCity Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to fetch cities",
      data: [],
    };
  }
}

/**
 * إنشاء مدينة جديدة
 */
export async function createCity(newName, newColor) {
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

    const resdata = await api.post("/cities", payload, {
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
    console.error("DEBUG createCity Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to create city",
    };
  }
}

/**
 * تحديث بيانات مدينة
 */
export async function updateCity(id, newName, newColor) {
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

    const resdata = await api.patch(`/cities/${id}`, payload, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateCity Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to update city",
    };
  }
}

/**
 * حذف مدينة
 */
export async function deleteCity(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/cities/${id}`, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteCity Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to delete city",
    };
  }
}
