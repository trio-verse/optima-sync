"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * Fetch stakeholders for a given client
 */
export async function getStakeholders(orgId, clientId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!orgId || !clientId) {
      return {
        success: false,
        message: "Organization ID or Client ID is missing.",
        data: [],
      };
    }

    const endpoint = clientId 
      ? `/clients/${clientId}/stakeholders` 
      : `/stakeholders`;

    const resdata = await api.get(endpoint, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    const list = resdata?.data?.data || resdata?.data || [];

    return {
      success: true,
      data: Array.isArray(list) ? list : [],
    };
  } catch (error) {
    console.error("DEBUG getStakeholders Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to fetch stakeholders",
      data: [],
    };
  }
}

/**
 * Create a new stakeholder for a client
 */
export async function createStakeholder(clientId, { name, phone, role }, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId || !clientId) {
      return {
        success: false,
        message: "Organization ID or Client ID is missing.",
      };
    }

    const payload = { name, phone, role };

    const resdata = await api.post(`/clients/${clientId}/stakeholders`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: resdata?.message || "Stakeholder added successfully",
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG createStakeholder Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to create stakeholder",
      errors: error.data?.errors || null,
    };
  }
}

/**
 * Update existing stakeholder information
 */
export async function updateStakeholder({ stakeholderId, name, phone, role, clientId, orgId }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId || !clientId || !stakeholderId) {
      return {
        success: false,
        message: "Organization ID, Client ID or Stakeholder ID is missing.",
      };
    }

    const payload = { name, phone, role };

    const resdata = await api.patch(
      `/clients/${clientId}/stakeholders/${stakeholderId}`,
      payload,
      {
        token,
        headers: { "X-Organization-ID": orgId },
      }
    );

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: resdata?.message || "Stakeholder updated successfully",
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateStakeholder Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to update stakeholder",
      errors: error.data?.errors || null,
    };
  }
}

/**
 * Delete a stakeholder
 */
export async function deleteStakeholder(orgId, clientId, stakeholderId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId || !clientId || !stakeholderId) {
      return {
        success: false,
        message: "Organization ID, Client ID or Stakeholder ID is missing.",
      };
    }

    const resdata = await api.delete(
      `/clients/${clientId}/stakeholders/${stakeholderId}`,
      {
        token,
        headers: { "X-Organization-ID": orgId },
      }
    );

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      message: resdata?.message || "Stakeholder deleted successfully",
    };
  } catch (error) {
    console.error("DEBUG deleteStakeholder Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to delete stakeholder",
    };
  }
}