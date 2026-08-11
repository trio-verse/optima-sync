"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";

/**
 * جلب تفاصيل المنظمة بواسطة الـ ID
 */
export async function getOrganisationById(organisationId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: null };
    }

    const cookieOrgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    const rawId =
      organisationId && organisationId !== "null" && organisationId !== "undefined"
        ? organisationId
        : cookieOrgId;

    const targetOrgId = rawId ? String(rawId).trim() : null;

    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "Organization ID is missing or invalid",
        data: null,
      };
    }

    const resdata = await api.get(`/organizations/${targetOrgId}`, {
      token,
      orgId: targetOrgId,
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data || null,
    };
  } catch (error) {
    console.error("DEBUG getOrganisationById Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to fetch organisation details.",
      data: null,
    };
  }
}

/**
 * جلب شعار المنظمة (Organisation Logo)
 */
export async function getOrganisationLogo(organisationId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", logo_url: null };
    }

    const cookieOrgId =
      cookieStore.get("organizationId")?.value ||
      cookieStore.get("organaizationId")?.value ||
      cookieStore.get("organaisationId")?.value;

    const rawId =
      organisationId && organisationId !== "null" && organisationId !== "undefined"
        ? organisationId
        : cookieOrgId;

    const targetOrgId = rawId ? String(rawId).trim() : null;

    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "Organization ID is missing or invalid",
        logo_url: null,
      };
    }

    const resdata = await api.get(`/organizations/${targetOrgId}`, {
      token,
      orgId: targetOrgId,
      cache: "no-store",
    });

    const orgData = resdata?.data || resdata;
    const rawLogo =
      orgData?.logo_url || orgData?.logo || orgData?.logo_path || null;

    if (!rawLogo) {
      return {
        success: true,
        message: "No logo set yet",
        logo_url: null,
      };
    }

    const fullLogoUrl = rawLogo.startsWith("/")
      ? `https://optima.trio-verse.com${rawLogo}`
      : rawLogo;

    return {
      success: true,
      message: "Logo fetched successfully",
      logo_url: fullLogoUrl,
    };
  } catch (error) {
    console.error("DEBUG getOrganisationLogo Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while fetching organisation logo.",
      logo_url: null,
    };
  }
}