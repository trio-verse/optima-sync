"use server";
// actions/campaignDetails.js
import { api } from "@/lib/api/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getAuthContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const orgId = cookieStore.get("organization_id")?.value;

  return {
    token,
    orgId,
    headers: {
      "X-Organization-ID": orgId || "",
    },
  };
}

export async function createContent(campaignId,orgId, formData) {
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
      title: formData.title,
      type: formData.type,
      channel_id: formData.channel_id,
      cost: formData.cost, // ستصل كـ Number جاهز من الفرونت إند
      status: formData.status,
      published_at: formData.published_at,
      description: formData.description,
      script: formData.script,
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
      revalidatePath(`/${orgId}/dashboard/marketing/campaigns/${campaignId}`);
    }
    return { success: true, data: res?.data?.data, };
  } catch (error) {
    return { success: false, error: error.data?.message || "Failed to update content" };
  }
}
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
 * Confirm Content Cost (Policy Gated)
 */
export async function confirmContentCost(contentId, campaignId, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const targetOrgId = orgId || cookieStore.get("organization_id")?.value;
    if (!targetOrgId) {
      return { success: false, error: "Organization ID is missing." };
    }


    const res = await api.post(
      `/campaigns/${campaignId}/contents/${contentId}/cost/confirm`,
      {},
      {
        token,
        headers: { "X-Organization-ID": targetOrgId },
        cache: "no-store",
      }
    );

    revalidatePath(`/${targetOrgId}/dashboard/marketing/campaigns/${campaignId}`);

    return { 
      success: true, 
      message: res?.data?.message || res?.message || "Cost confirmed successfully",
      data: res?.data?.data || res?.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error?.data?.message || error?.message || "Failed to confirm cost" 
    };
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
/**
 * Update Content Status Only (New Endpoint)
 */
export async function updateContentStatus(contentId, campaignId, orgId, status) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };
    if (!orgId) return { success: false, error: "Organization ID is missing." };

    const res = await api.patch(
      `/campaigns/${campaignId}/contents/${contentId}/status`,
      { status },
      {
        token,
        headers: { "X-Organization-ID": orgId },
        cache: "no-store",
      }
    );

    revalidatePath(`/${orgId}/dashboard/marketing/campaigns/${campaignId}`);

    return {
      success: true,
      message: res?.data?.message || res?.message || "Content status changed successfully",
      data: res?.data?.data || res?.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.data?.message || error?.message || "Failed to update status",
    };
  }
}