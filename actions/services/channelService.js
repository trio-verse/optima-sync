"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * جلب قائمة القنوات (Channels)
 */
export async function getChannels(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/channels", {
      token,
      orgId,
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data || [],
    };
  } catch (error) {
    console.error("DEBUG getChannels Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to fetch channels",
      data: [],
    };
  }
}

/**
 * إنشاء قناة جديدة
 */
export async function createChannel(newName, newColor,orgId) {
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

    const resdata = await api.post("/channels", payload, {
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
    console.error("DEBUG createChannel Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to create channel",
    };
  }
}

/**
 * تحديث بيانات قناة
 */
export async function updateChannel(id, newName, newColor,orgId) {
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

    const resdata = await api.patch(`/channels/${id}`, payload, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateChannel Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to update channel",
    };
  }
}

/**
 * حذف قناة
 */
export async function deleteChannel(id,orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/channels/${id}`, {
      token,
      orgId,
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteChannel Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to delete channel",
    };
  }
}