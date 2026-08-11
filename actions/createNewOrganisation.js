"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";
import { redirect } from "next/navigation";
/**
 * إنشاء بروفايل المنظمة وتخزين الـ ID في الكوكيز
 */
export async function createOrganisationProfile(formDataPayload) {
  let targetRedirectUrl = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const formattedPayload = {
      name: String(formDataPayload.name || "").trim(),
      email: String(formDataPayload.email || "").trim(),
      phone: String(formDataPayload.phone_number || "").trim(),
      phone_number: String(formDataPayload.phone_number || "").trim(),
      address: String(formDataPayload.address || "").trim(),
      description: String(formDataPayload.description || "").trim(),
    };

    const resdata = await api.post("/organizations", formattedPayload, {
      token,
    });

    const OrgId = resdata?.data?.id;
    if (!OrgId) {
      return {
        success: false,
        message: "Organization ID was not returned by API.",
      };
    }

    revalidatePath("/dashboard");

    targetRedirectUrl = `/${OrgId}/upload-logo`;
  } catch (error) {
    console.error("DEBUG createOrganisationProfile Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to create organisation profile.",
      errors: error.data?.errors || error.data?.data || null,
    };
  }
  if (targetRedirectUrl) {
    redirect(targetRedirectUrl);
  }
}

/**
 * رفع شعار المنظمة (Initial Logo)
 */
export async function uploadInitialLogo(imageFile) {
  let targetRedirectUrl = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID not found in cookies",
      };
    }

    const formData = new FormData();
    formData.append("logo", imageFile);

    const resdata = await api.post(`/organizations/${orgId}/logo`, formData, {
      token,
      orgId,
    });

    revalidatePath("/dashboard");
    targetRedirectUrl = `/${orgId}/dashboard`;
  } catch (error) {
    console.error("DEBUG uploadInitialLogo Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while uploading the logo.",
    };
  }
  if (targetRedirectUrl) {
    redirect(targetRedirectUrl);
  }
}
