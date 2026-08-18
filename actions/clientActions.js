"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * جلب قائمة العملاء مع التصفية والترقيم (Pagination)
 */
export async function getClients(options = {}, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing.",
        data: [],
      };
    }

    const {
      cityId,
      industryId,
      type,
      searchName,
      searchContact,
      page,
      perPage,
    } = options;

    const params = {
      organization_id: orgId,
    };

    if (page) params.page = Number(page);
    if (perPage) params.per_page = Number(perPage);
    if (cityId) params.city_id = Number(cityId);
    if (industryId) params.industry_id = Number(industryId);
    if (type?.trim()) params.type = type.trim();
    if (searchName?.trim()) params["search[name]"] = searchName.trim();
    if (searchContact?.trim())
      params["search[contact_info]"] = searchContact.trim();

    const resdata = await api.get("/clients", {
      token,
      headers: { "X-Organization-ID": orgId },
      params,
      next: { revalidate: 60 },
    });

    return {
      success: true,
      message: "Clients data fetched successfully.",
      data: resdata?.data?.data || [],
      meta: resdata?.data?.meta || resdata?.meta || {},
    };
  } catch (error) {
    console.error("DEBUG getClients Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while fetching clients.",
      data: [],
    };
  }
}

/**
 * إنشاء عميل جديد
 */
export async function createClient(formDataPayload, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const payload = {
      ...formDataPayload,
      organization_id: Number(orgId),
    };

    const resdata = await api.post("/clients", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: resdata?.message || "The client was created successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG createClient Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while creating the client.",
      errors: error.data?.errors || null,
    };
  }
}

/**
 * تحديث بيانات عميل
 */
export async function updateClient(id, formDataPayload, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const payload = {
      ...formDataPayload,
      organization_id: Number(orgId),
    };

    const resdata = await api.patch(`/clients/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: resdata?.message || "Client updated successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateClient Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while updating the client.",
      errors: error.data?.errors || null,
    };
  }
}

/**
 * حذف عميل
 */
export async function deleteClient(id, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const resdata = await api.delete(`/clients/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: resdata?.message || "Client deleted successfully",
    };
  } catch (error) {
    console.error("DEBUG deleteClient Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while deleting the client.",
    };
  }
}