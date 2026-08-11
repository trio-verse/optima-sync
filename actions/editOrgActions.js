"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

/**
 * تحديث معلومات بروفايل المنظمة
 */
export async function updateOrganisationProfile(organisationId, formDataPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Token not found.",
      };
    }

    const cookieOrgId =
      cookieStore.get("organaizationId")?.value ||
      cookieStore.get("organizationId")?.value;

    const rawOrgId =
      organisationId && organisationId !== "null" && organisationId !== "undefined"
        ? organisationId
        : cookieOrgId;

    const targetOrgId = rawOrgId ? String(rawOrgId).trim() : null;

    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "No Organisation ID provided.",
      };
    }

    const payloadToSend = {
      name: String(formDataPayload.name || "").trim(),
      email: String(formDataPayload.email || "").trim(),
      phone: String(formDataPayload.phone_number || formDataPayload.phone || "").trim(),
      phone_number: String(formDataPayload.phone_number || formDataPayload.phone || "").trim(),
      address: String(formDataPayload.address || "").trim(),
      description: String(formDataPayload.description || "").trim(),
    };

    const resdata = await api.patch(`/organizations/${targetOrgId}`, payloadToSend, {
      token,
    });

    revalidatePath("/dashboard/settings/profile");

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateOrganisationProfile Error:", error);

    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to update organisation profile.",
      errors: error.data?.errors || null,
    };
  }
}

/**
 * تحديث شعار المنظمة (Logo Update)
 */
export async function updateOrganisationLogo(organisationId, imageFile) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Token not found.",
      };
    }

    const cookieOrgId =
      cookieStore.get("organaizationId")?.value ||
      cookieStore.get("organizationId")?.value;

    const rawOrgId =
      organisationId && organisationId !== "null" && organisationId !== "undefined"
        ? organisationId
        : cookieOrgId;

    const targetOrgId = rawOrgId ? String(rawOrgId).trim() : null;

    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "No Organisation ID found.",
      };
    }

    const formData = new FormData();
    formData.append("logo", imageFile);

    const resdata = await api.post(`/organizations/${targetOrgId}/logo`, formData, {
      token,
      orgId: targetOrgId,
    });

    revalidatePath("/dashboard/settings/profile");

    return {
      success: true,
      logo_url: resdata?.data?.logo_url || resdata?.logo_url,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG updateOrganisationLogo Error:", error);

    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to update organisation logo.",
      errors: error.data?.errors || null,
    };
  }
}