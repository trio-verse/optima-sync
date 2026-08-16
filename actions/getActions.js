"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";

/**
 * جلب تفاصيل المنظمة بواسطة الـ ID
 */
export async function getOrganisationById(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: null };
    }

    const targetOrgId = orgId? String(orgId).trim() : null;


    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "Organization ID is missing or invalid",
        data: null,
      };
    }

    const resdata = await api.get(`/organizations/${targetOrgId}`, {
      token,
      headers: {
        "x-organization-id": targetOrgId, 
      },
      cache: "no-store",
    });

    return {
      success: true,
      data: resdata?.data?.data || null,
    };
  } catch (error) {
    console.error("DEBUG getOrganisationById Error:", error.cause);
    console.error("DEBUG getOrganisationById Error:", error.message);
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
export async function getOrganisationLogo(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", logo_url: null };
    }



  const targetOrgId = orgId ? String(orgId).trim() : null;

    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "Organization ID is missing or invalid",
        logo_url: null,
      };
    }

    const resdata = await api.get(`/organizations/${targetOrgId}`, {
      token,
      headers: {
        "x-organization-id": targetOrgId, 
      },
      cache: "no-store",
    });
    // 👈 طباعة الاستجابة القادمة من API لمعاينة الحقول بالضبط
    console.log("RAW BACKEND RESPONSE:", resdata);

    const orgData = resdata?.data?.data || resdata?.data;
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