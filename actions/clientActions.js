"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

function sanitizeClientPayload(raw) {
  const payload = {};

  const stringFields = [
    "name",
    "email",
    "phone",
    "whatsapp",
    "address",
    "notes",
    "website",
    "facebook",
    "instagram",
  ];
  stringFields.forEach((key) => {
    if (
      raw[key] !== undefined &&
      raw[key] !== null &&
      String(raw[key]).trim() !== ""
    ) {
      payload[key] = String(raw[key]).trim();
    }
  });

  // الفورم بيرسل الحقل باسم "type"، بس الـ backend بينتظره باسم "client_type"
  if (
    raw.client_type !== undefined &&
    raw.client_type !== null &&
    String(raw.client_type).trim() !== ""
  ) {
    payload.client_type = String(raw.client_type).trim();
  } else if (
    raw.type !== undefined &&
    raw.type !== null &&
    String(raw.type).trim() !== ""
  ) {
    payload.client_type = String(raw.type).trim();
  }

  const numericFields = ["city_id", "industry_id", "organization_id"];
  numericFields.forEach((key) => {
    const val = raw[key];
    if (
      val !== undefined &&
      val !== null &&
      val !== "" &&
      !isNaN(Number(val))
    ) {
      payload[key] = Number(val);
    }
  });

  return payload;
}

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
      cache: "no-store",
    });
    console.log(resdata);
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
    const cleanedPayload = sanitizeClientPayload(formDataPayload);
    const payload = {
      ...cleanedPayload,
      organization_id: Number(orgId),
    };

    const resdata = await api.post("/clients", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });
    //console.log( "fffffffffffffffffff" , resdata);
    revalidatePath(`/${orgId}/dashboard/clients`);

    return {
      success: true,
      message: resdata?.message || "The client was created successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG createClient Error:", error);
    console.error("DEBUG createClient Error data:", error.data);
    console.error("DEBUG createClient Error message:", error.message);
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

    const cleanedPayload = sanitizeClientPayload(formDataPayload);
    const payload = {
      ...cleanedPayload,
      organization_id: Number(orgId),
    };

    const resdata = await api.patch(`/clients/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath(`/${orgId}/dashboard/clients`);

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

    revalidatePath(`/${orgId}/dashboard/clients`);

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