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
    const res = await api.get("/campaigns", {
      token,
      headers: orgId ? { "X-Organization-ID": orgId } : {},
      cache: "no-store",
    });

    return { success: true, data: res.data?.data || res.data || [] };
  } catch (error) {
    return {
      success: false,
      error: error.data?.message || "Failed to fetch campaigns",
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
    const res = await api.post("/campaigns", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    console.log(res);

    revalidatePath(`/${orgId}/dashboard/marketing/campaigns`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      error: error.data?.message || "Failed to create campaign",
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

    await api.delete(`/campaigns/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    revalidatePath("/campaigns");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.data?.message || "Failed to delete campaign",
    };
  }
}
