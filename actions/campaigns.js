"use server";

import { api } from "@/lib/api/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Fetch list of campaigns
 */
export async function getCampaigns(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const resdata = await api.get("/campaigns", {
      token,
      headers: orgId ? { "X-Organization-ID": orgId } : {},
      cache: "no-store",
    });
    console.log("@@@@@@@@@@@@@@@@@@@@@@@", resdata);
    return {
      success: true,
      message: "Campaigns data fetched successfully.",
      data: resdata?.data?.data || [],
      meta: resdata?.data?.meta || resdata?.meta || {},
    };
  } catch (error) {
    console.error("DEBUG getCampaign Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while fetching Campaigns.",
      data: [],
    };
  }
}

export async function getCampaignById(id ,orgId ) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const res = await api.get(`/campaigns/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    return { success: true, data: res.data?.data || res.data };
  } catch (error) {
    return {
      success: false,
      error: error.data?.message || "Failed to fetch campaign details",
    };
  }
}

/**
 * Create a new campaign
 */
export async function createCampaign(formData, orgId) {
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
      name: formData.get("name"),
      description: formData.get("description"),
      estimated_content_count: Number(formData.get("estimated_content_count")),
      expected_budget: Number(formData.get("expected_budget")),
      starts_at: formData.get("start_date"),
      end_at: formData.get("end_date"),
      status: formData.get("status"),
      target: formData.get("target"),
    };
    const resdata = await api.post("/campaigns", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    //console.log(resdata);

    revalidatePath(`/${orgId}/dashboard/marketing/campaigns`);
    return {
      success: true,
      message: resdata?.message || "The campaign created successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG createCampaign Error:", error);
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

export async function updateCampaign(id, formData, orgId) {
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
      name: formData.get("name"),
      description: formData.get("description"),
      estimated_content_count: Number(formData.get("estimated_content_count")),
      expected_budget: Number(formData.get("expected_budget")),
      starts_at: formData.get("start_date"),
      end_at: formData.get("end_date"),
      status: formData.get("status"),
      target: formData.get("target"),
    };

    const resdata = await api.patch(`/campaigns/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    revalidatePath(`/${orgId}/dashboard/marketing/campaigns/${id}`);
    revalidatePath(`/${orgId}/dashboard/marketing/campaigns`);

    return {
      success: true,
      message: resdata?.data?.message || "Campaign updated successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateCampaign Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while updating the campaign.",
      errors: error.data?.errors || null,
    };
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const resdata = await api.delete(`/campaigns/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    console.log("$$$$$$$$$$$", resdata);
    revalidatePath(`/${orgId}/dashboard/marketing/campaigns`);
    return {
      success: true,
      message: resdata?.data?.message || "Deleted successfully",
    };
  } catch (error) {
    console.error("DEBUG deleteCampaigns Error:", error);
    return {
      success: false,
      message: error.data?.message || error.message || "Delete failed",
    };
  }
}

/**
 * Fetch marketing analytics overview (org-level)
 */
/**
 * Fetch marketing analytics overview (org-level)
 * GET /marketing/analytics
 */
export async function getMarketingAnalytics(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const resdata = await api.get("/marketing/analytics", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    return {
      success: true,
      message: "Marketing analytics fetched successfully.",
      data: resdata?.data?.data || null,
    };
  } catch (error) {
    console.error("DEBUG getMarketingAnalytics Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while fetching marketing analytics.",
      data: null,
    };
  }
}

export async function getEffectiveCampaigns(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
        data: [],
      };
    }

    const response = await api.get(
      "/marketing/analytics/effective-campaigns",
      {
        token,
        headers: { "X-Organization-ID": orgId },
        cache: "no-store",
      }
    );

    return {
      success: true,
      data: Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [],
      message: response?.data?.message || "Success",
    };
  } catch (error) {
    console.error(" getEffectiveCampaigns Error:", error);
    return {
      success: false,
      message:
        error?.data?.message ||
        error?.message ||
        "Failed to fetch effective campaigns",
      data: [],
    };
  }
}

export async function getAllCampaigns(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
        data: [],
      };
    }

    const response = await api.get("/campaigns", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    return {
      success: true,
      data: response?.data?.data || [],
      message: response?.data?.message || "Success",
    };
  } catch (error) {
    console.error(" getAllCampaigns Error:", error);
    return {
      success: false,
      message:
        error?.data?.message ||
        error?.message ||
        "Failed to fetch all campaigns",
      data: [],
    };
  }
}