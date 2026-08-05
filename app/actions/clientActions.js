"use server";

import { cookies } from "next/headers";

const API_BASE_URL = "https://optima.trio-verse.com/api/v1";

/*
 * Create New Client
 */
export async function createClient(formDataPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      formDataPayload?.organization_id ||
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;
    if (!token)
      return { success: false, message: "Unauthorized: Please log in again" };
    if (!orgId) return { success: false, message: "Organization ID not found" };

    const payload = {
      ...formDataPayload,
      organization_id: orgId,
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const resdata = await response.json();
    console.log(resdata);
    if (!response.ok) {
      return {
        success: false,
        message:
          resdata?.data?.message ||
          resdata?.message ||
          "Failed to create client.",
        errors: resdata?.errors || null,
      };
    }
    return {
      success: true,
      message: "Client created successfully.",
      data: resdata.data,
    };
  } catch (error) {
    console.error("DEBUG createClient Error:", error);
    return {
      success: false,
      message:
        "An error occurred while connecting to the server to create the client.",
    };
  }
}

/*
 * Update Client data
 */
export async function updateClient(clientId, formDataPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId =
      formDataPayload?.organization_id ||
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    if (!token)
      return { success: false, message: "Unauthorized: Please log in again" };
    if (!orgId) return { success: false, message: "Organization ID not found" };
    if (!clientId)
      return {
        success: false,
        message: "The client ID to be updated is missing.",
      };

    const payload = {
      ...formDataPayload,
      organization_id: orgId,
    };

    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const resdata = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          resdata?.data?.message ||
          resdata?.message ||
          "Failed to update client data.",
        errors: resdata?.errors || null,
      };
    }

    return {
      success: true,
      message: "Client data updated successfully.",
      data: resdata.data,
    };
  } catch (error) {
    console.error("DEBUG updateClient Error:", error);
    return {
      success: false,
      message:
        "An error occurred while connecting to the server to update the client.",
    };
  }
}

/*
 * Get Clients List with Filters & Pagination
 */
export async function getClients(options = {}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized", data: [] };

    const page = options.page ? Number(options.page) : 1;
    const perPage = options.perPage ? Number(options.perPage) : 15;
    const searchName = options.searchName || "";
    const searchContact = options.searchContact || "";
    const cityId = options.cityId || "";
    const industryId = options.industryId || "";
    const type = options.type || "";

    const queryParams = new URLSearchParams();

    if (options.cityId && options.cityId !== "") {
      queryParams.append("city_id", Number(options.cityId));
    }

    if (options.industryId && options.industryId !== "") {
      queryParams.append("industry_id", Number(options.industryId));
    }

    if (options.type && options.type.trim() !== "") {
      queryParams.append("type", options.type.trim());
    }

    if (options.searchName && options.searchName.trim() !== "") {
      queryParams.append("search[name]", options.searchName.trim());
    }

    if (options.searchContact && options.searchContact.trim() !== "") {
      queryParams.append("search[contact_info]", options.searchContact.trim());
    }

    const response = await fetch(
      `${API_BASE_URL}/clients?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 },
      },
    );

    const resdata = await response.json();
    console.log(resdata);

    if (!response.ok) {
      return {
        success: false,
        message: resdata?.message || "Failed to fetch clients data.",
        data: [],
      };
    }

    const clientsData = resdata?.data || [];
    const paginationMeta = resdata?.data?.meta || {};
    return {
      success: true,
      message: "Clients data fetched successfully.",
      data: clientsData,
      meta: paginationMeta,
    };
  } catch (error) {
    console.error("DEBUG getClients Error:", error);
    return {
      success: false,
      message: "An error occurred while fetching clients.",
      data: [],
    };
  }
}
