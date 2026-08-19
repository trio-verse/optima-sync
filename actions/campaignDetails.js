"use server";

import { api } from "@/lib/api/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { mockCampaignDetails, mockContents } from "@/lib/mock/campaignDetailsData";

const USE_MOCK = true;

let localContents = [...mockContents];

async function getAuthContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const orgId = cookieStore.get("organization_id")?.value;

  return {
    token,
    headers: {
      "X-Organization-ID": orgId || "",
    },
  };
}

/**
 * Fetch campaign analytics & overview
 */
export async function getCampaignDetails(id) {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, data: mockCampaignDetails[id] || mockCampaignDetails[1] };
  }

  try {
    const { token, headers } = await getAuthContext();
    const res = await api.get(`/campaigns/${id}/analytics`, {
      token,
      headers,
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
export async function getCampaignContents(campaignId) {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, data: localContents.filter((c) => c.campaign_id == campaignId) };
  }

  try {
    const { token, headers } = await getAuthContext();
    const res = await api.get(`/campaigns/${campaignId}/contents`, {
      token,
      headers,
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
export async function createContent(campaignId, formData) {
  if (USE_MOCK) {
    const newContent = {
      id: Date.now(),
      campaign_id: Number(campaignId),
      title: formData.get("title"),
      description: formData.get("description"),
      script: formData.get("script"),
      channel: formData.get("channel"),
      cost: parseFloat(formData.get("cost")) || 0,
      status: "draft",
      cost_confirmed_by: null,
      cost_confirmed_at: null,
      published_at: null,
    };
    localContents.unshift(newContent);
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: newContent };
  }

  try {
    const { token, headers } = await getAuthContext();
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      script: formData.get("script"),
      channel: formData.get("channel"),
      cost: parseFloat(formData.get("cost")) || 0,
    };

    const res = await api.post(`/campaigns/${campaignId}/contents`, payload, {
      token,
      headers,
      cache: "no-store",
    });
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: error.data?.message || "Failed to create content" };
  }
}

/**
 * Update content status (Auto fills published_at when status = published)
 */
export async function updateContentStatus(contentId, campaignId, newStatus) {
  if (USE_MOCK) {
    localContents = localContents.map((item) => {
      if (item.id === contentId) {
        return {
          ...item,
          status: newStatus,
          published_at: newStatus === "published" ? new Date().toISOString() : item.published_at,
        };
      }
      return item;
    });
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true };
  }

  try {
    const { token, headers } = await getAuthContext();
    await api.patch(
      `/contents/${contentId}/status`,
      { status: newStatus },
      { token, headers, cache: "no-store" }
    );
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.data?.message || "Failed to update status" };
  }
}

/**
 * Confirm Content Cost (Policy Gated)
 */
export async function confirmContentCost(contentId, campaignId) {
  if (USE_MOCK) {
    localContents = localContents.map((item) => {
      if (item.id === contentId) {
        return {
          ...item,
          cost_confirmed_by: "Current Admin",
          cost_confirmed_at: new Date().toISOString(),
        };
      }
      return item;
    });
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true };
  }

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