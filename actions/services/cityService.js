"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * جلب قائمة المدن
 */
export async function getCity(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/cities", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data?.data || [],
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
export async function createCity(newName, newColor,orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.post("/cities", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
      id: resdata?.data?.data.id,
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
export async function updateCity(id, newName, newColor,orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.patch(`/cities/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
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
export async function deleteCity(id,orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/cities/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteCity Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to delete city",
    };
  }
}
