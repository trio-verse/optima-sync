// actions/campaignDetails.js
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
    orgId,
    headers: {
      "X-Organization-ID": orgId || "",
    },
  };
}

export async function createContent(campaignId, formData) {
  try {
    const { token, headers } = await getAuthContext();
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

    const res = await api.post(`/campaigns/${campaignId}/contents`, payload, {
      token,
      headers,
      cache: "no-store",
    });

    revalidatePath(`/marketing/campaign/${campaignId}`);
    return {
      success: true,
      message: res?.message || "The content was created successfully",
      data: res?.data?.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.data?.message || "Failed to create content",
    };
  }
}

export async function updateContent(contentId, formData, campaignId) {
  try {
    const { token, headers } = await getAuthContext();

    const payload =
      formData instanceof FormData
        ? {
            title: formData.get("title"),
            type: formData.get("type"),
            channel_id: formData.get("channel_id"),
            cost: parseFloat(formData.get("cost")) || 0,
            status: formData.get("status"),
            published_at: formData.get("published_at") || null,
            description: formData.get("description"),
            script: formData.get("script"),
          }
        : formData;

    const res = await api.put(`/contents/${contentId}`, payload, {
      token,
      headers,
      cache: "no-store",
    });

    if (campaignId) {
      revalidatePath(`/marketing/campaign/${campaignId}`);
    }
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      error: error.data?.message || "Failed to update content",
    };
  }
}
