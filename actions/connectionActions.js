"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

export async function getAllConnections(orgId, params = {}) {
  try {
    if (!orgId) {
      return { success: false, message: "Organization ID is required", data: [] };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { success: false, message: "Unauthorized", data: [] };

    const query = new URLSearchParams(params).toString();
    const endpoint = `/connections${query ? `?${query}` : ""}`;

    const resdata = await api.get(endpoint, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data?.data || resdata?.data || [],
      meta: resdata?.data?.meta || {},
    };
  } catch (error) {
    console.error("DEBUG getAllConnections Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to fetch connections",
      data: [],
    };
  }
}

export async function getConnections(clientId, orgId) {
  try {
    if (!clientId || !orgId) {
      return { success: false, message: "Client ID and Organization ID are required", data: [] };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { success: false, message: "Unauthorized", data: [] };

    const resdata = await api.get(`/clients/${clientId}/connections`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data?.data || [],
      meta: resdata?.data?.meta || {},
    };
  } catch (error) {
    console.error("DEBUG getConnections Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to fetch connections",
      data: [],
    };
  }
}

export async function createConnection(clientId, payload, orgId) {
  try {
    if (!clientId || !orgId) {
      return { success: false, message: "Client ID and Organization ID are required" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const body = {
      product_id: payload.productId,
      stage: payload.stage,
      channel_id: payload.channelId,
      ...(payload.assigneeId && { assignee_id: payload.assigneeId }),
      ...(payload.initiatedBy && { initiated_by: payload.initiatedBy }),
    };

    const resdata = await api.post(`/clients/${clientId}/connections`, body, {
      token,
      headers: { "X-Organization-ID": orgId },
    });
    revalidatePath(`/${orgId}/dashboard/clients/${clientId}`);

    return {
      success: true,
      data: resdata?.data?.data,
      message: resdata?.data?.message || "Connection created successfully",
    };
  } catch (error) {
    console.error("DEBUG createConnection Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to create connection",
      errors: error.data?.errors || null,
    };
  }
}

export async function updateConnection(connection_id, payload, orgId, clientId) {
  try {
    if (!connection_id || !orgId) {
      return { success: false, message: "Connection ID and Organization ID are required" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const body = {
      product_id: payload.productId,
      stage: payload.stage,
      channel_id: payload.channelId,
      ...(payload.assigneeId && { assignee_id: payload.assigneeId }),
      ...(payload.initiatedBy && { initiated_by: payload.initiatedBy }),
    };

    const resdata = await api.patch(`/connections/${connection_id}`, body, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if (clientId) {
      revalidatePath(`/${orgId}/dashboard/clients/${clientId}`);
    }
    revalidatePath(`/${orgId}/dashboard/sales`);

    return {
      success: true,
      data: resdata?.data?.data,
      message: resdata?.data?.message || "Updated successfully",
    };
  } catch (error) {
    console.error("DEBUG updateConnection Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Update failed",
      errors: error.data?.errors || null,
    };
  }
}

export async function deleteConnection(connection_id, orgId, clientId) {
  try {
    if (!connection_id || !orgId) {
      return { success: false, message: "Connection ID and Organization ID are required" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const resdata = await api.delete(`/connections/${connection_id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if (clientId) {
      revalidatePath(`/${orgId}/dashboard/clients/${clientId}`);
    }
    revalidatePath(`/${orgId}/dashboard/sales`);

    return {
      success: true,
      message: resdata?.data?.message || "Deleted successfully",
    };
  } catch (error) {
    console.error("DEBUG deleteConnection Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Delete failed",
    };
  }
}