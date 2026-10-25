"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";
import { Client, ClientFilters, CreateClientInput } from "@/types/crm";
import { PaginationMeta } from "@/types/api";

function sanitizeClientPayload(raw: Record<string, any>): Record<string, any> {
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
    "client_type",
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

  // // الفورم بيرسل الحقل باسم "type"، بس الـ backend بينتظره باسم "client_type"
  // if (
  //   raw.client_type !== undefined &&
  //   raw.client_type !== null &&
  //   String(raw.client_type).trim() !== ""
  // ) {
  //   payload.client_type = String(raw.client_type).trim();
  // } else if (
  //   raw.type !== undefined &&
  //   raw.type !== null &&
  //   String(raw.type).trim() !== ""
  // ) {
  //   payload.client_type = String(raw.type).trim();
  // }

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

export async function getClients(
  options: ClientFilters = {},
  orgId?: string,
): Promise<{
  success: boolean;
  message: string;
  data: Client[];
  meta: PaginationMeta;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [], meta: {} };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing.",
        data: [],
        meta: {},
      };
    }

    const {
      city_id,
      industry_id,
      client_type,
      name,
      contact_info,
      page,
      perPage,
    } = options;

    const params: Record<string, string | number | boolean | undefined> = {
      organization_id: orgId,
    };

    if (page) params.page = Number(page);
    if (perPage) params.per_page = Number(perPage);
    if (city_id) params.city_id = Number(city_id);
    if (industry_id) params.industry_id = Number(industry_id);
    if (client_type?.trim()) params.client_type = client_type.trim();
    if (name?.trim()) params["search[name]"] = name.trim();
    if (contact_info?.trim())
      params["search[contact_info]"] = contact_info.trim();

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
      meta: resdata?.data?.meta || {},
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
      meta: {},
    };
  }
}

export async function createClient(
  formDataPayload: CreateClientInput,
  orgId?: string,
): Promise<{ success: boolean; message: string; data: Client }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: null };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing.",
        data: null,
      };
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
      message: resdata?.data.message || "The client was created successfully",
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
      data: null,
    };
  }
}

export async function updateClient(
  id: number,
  formDataPayload: Client,
  orgId?: string,
): Promise<{
  success: boolean;
  message: string;
  data: Client;
  errors?: Record<string, string[] | string>;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: null };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing.",
        data: null,
      };
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
      message: resdata?.data.message || "Client updated successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateClient Error:", error);
    return {
      success: false,
      data: null,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while updating the client.",
      errors: error.data?.errors || null,
    };
  }
}

export async function deleteClient(
  id: number,
  orgId?: string,
): Promise<{ success: boolean; message: string; data?: Client }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: null };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing.",
        data: null,
      };
    }

    const resdata = await api.delete(`/clients/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath(`/${orgId}/dashboard/clients`);

    return {
      success: true,
      message: resdata?.data.message || "Client deleted successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteClient Error:", error);
    return {
      success: false,
      data: null,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while deleting the client.",
    };
  }
}
