"use server";

import { api } from "@/lib/api/client";
import { ApiResponse, Campaign, CampaignRequest, CampaignStats, CampaignStatus, EffectiveCampaigns, MarketingAnalytics, PaginationMeta } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { promises } from "node:dns";

/**
 * Fetch list of campaigns
 */
export async function getCampaigns(orgId?:string):Promise<ApiResponse<Campaign[]>> {
  try {
    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const resdata = await api.get("/campaigns", {
      headers: orgId ? { "X-Organization-ID": orgId } : {},
      cache: "no-store",
    });
    return {
      success: true,
      message: "Campaigns data fetched successfully.",
      data: resdata?.data?.data  || [],
      meta: resdata?.data?.meta || {},
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

export async function getCampaignById(id:number ,orgId?:string ):Promise<ApiResponse<Campaign>> {
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
    console.log("vvvvvvvvvvv",res);
    return { success: true, data: res.data?.data || res.data };
  } catch (error) {
    return {
      success: false,
      errors: error.data?.message || "Failed to fetch campaign details",
    };
  }
}

/**
 * Create a new campaign
 */
export async function createCampaign(formData:CampaignRequest, orgId?:string):Promise<ApiResponse<CampaignRequest>> {
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
      name: formData.name,
      description: formData.description,
      estimated_content_count: Number(formData.estimated_content_count),
      expected_budget: Number(formData.expected_budget),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      target: formData.target,
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
      message: resdata?.data.message || "The campaign created successfully",
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

export async function updateCampaign(id:string, formData:CampaignRequest, orgId?:string):Promise<ApiResponse<CampaignRequest>> {
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
      name: formData.name,
      description: formData.description,
      estimated_content_count: Number(formData.estimated_content_count),
      expected_budget: Number(formData.expected_budget),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
      target: formData.target,
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
export async function deleteCampaign(id:number, orgId?:string):Promise<ApiResponse<CampaignRequest>> {
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
export async function getMarketingAnalytics(orgId:string):Promise<ApiResponse<MarketingAnalytics>>{
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

// actions/campaigns.js

export async function getEffectiveCampaigns(orgId:string, { page = 1, perPage = 15, status="all", sort = "cpl" } = {}) : Promise<ApiResponse<EffectiveCampaigns[]>>{
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || !orgId) {
      return { success: false, message: "Unauthorized or missing Org ID", data: [], meta: {} };
    }

    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    if (status && status !== "all") {
      params.append("status", status);
    }
    if (sort) {
      params.append("sort", sort); 
    }

    const response = await api.get(`/marketing/analytics/effective-campaigns?${params.toString()}`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    const rawData = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
      ? response.data.data
      : Array.isArray(response)
      ? response
      : [];

    const metaData = response?.data?.meta || response?.data.meta || {
      current_page: page,
      has_more: rawData.length === perPage,
    };

    return {
      success: true,
      data: rawData,
      meta: metaData,
      message: "Success",
    };
  } catch (error) {
    console.error("getEffectiveCampaigns Error:", error);
    return {
      success: false,
      message: error?.data?.message || error?.message || "Failed to fetch effective campaigns",
      data: [],
      meta: {},
    };
  }
}
export async function getAllCampaigns(orgId:string):Promise<ApiResponse<Campaign[]>> {
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
    console.log(response);
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