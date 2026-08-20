"use server";

import { api } from "@/lib/api/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getAuthContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const orgId = cookieStore.get("organization_id")?.value;

  return {
    token,
    headers: { "X-Organization-ID": orgId },
  };
}

/**
 * Fetch campaign analytics & overview
 */
export async function getCampaignById(id) {
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
    return { success: false, error: error.data?.message || "Failed to fetch campaign details" };
  }
}

/**
 * Fetch contents list for campaign
 */
export async function getCampaignContents(campaignId,orgId) {
  try {
      const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const res = await api.get(`/campaigns/${campaignId}/contents`, {
      token,
         headers: { "X-Organization-ID": orgId },

      cache: "no-store",
    });
    return { success: true, data: res.data?.data || res.data || [] };
  } catch (error) {
    return { success: false, error: error.data?.message || "Failed to fetch contents" };
  }
}

/**
 * Create content for campaign
 */
export async function createContent(campaignId ,orgId ,formData ) {
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
      title: formData.get("title"),
      type: formData.get("type"),
      channel_id: formData.get("channel_id"),
      cost: parseFloat(formData.get("cost")) || 0,
      status: formData.get("status"),
      published_at: formData.get("published_at") || null,
      description: formData.get("description"),
      script: formData.get("script"),
    };

    const resdata = await api.post(`/campaigns/${campaignId}/contents`, payload, {
      token,
        headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    revalidatePath(`/campaigns/${campaignId}`);
      return {
      success: true,
      message: resdata?.message || "The content was created successfully",
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.data?.message || "Failed to create content" };
  }
}

/**
 * Update full content or status
 */
export async function updateContent(contentId, orgId ,formData, campaignId) {
  try {
      const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    
    // دعم إرسال FormData أو Object عادي
    const payload = formData instanceof FormData ? {
      title: formData.get("title"),
      type: formData.get("type"),
      channel_id: formData.get("channel_id"),
      cost: parseFloat(formData.get("cost")) || 0,
      status: formData.get("status"),
      published_at: formData.get("published_at") || null,
      description: formData.get("description"),
      script: formData.get("script"),
    } : formData;
console.log(payload)
    const res = await api.patch(`/campaigns/${campaignId}/contents/${contentId}`, payload, {
      token,
         headers: { "X-Organization-ID": orgId },

      cache: "no-store",
    });

    if (campaignId) {
      revalidatePath(`/campaigns/${campaignId}`);
    }
    return { success: true, data: res?.data?.data, };
  } catch (error) {
    return { success: false, error: error.data?.message || "Failed to update content" };
  }
}

/**
 * Confirm Content Cost (Policy Gated)
 */
export async function confirmContentCost(contentId, campaignId) {
  try {
    const { token, headers } = await getAuthContext();
    await api.patch(
      `/contents/${contentId}/confirm-cost`,
      {},
      { token, headers, cache: "no-store" }
    );
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.data?.message || "Unauthorized or failed to confirm cost" };
  }
}  

export async function getCampaignAnalytics(campaignId,orgId){
   try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const resdata = await api.get(`/campaigns/${campaignId}/analytics`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    const extractedData =resdata?.data?.campaign 
      ? resdata.data 
      : (resdata?.data?.data || resdata?.data || null);
    return {
      success: true,
      message: "campaign analytics fetched successfully.",
      data:extractedData||null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.data?.message||error.message||"An error occurred while fetching campaign analytics.",
    };
  }
}
 
