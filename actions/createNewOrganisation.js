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
      phone: String(formDataPayload.phone || formDataPayload.phone_number || "").trim(),
      address: String(formDataPayload.address || "").trim(),
      description: String(formDataPayload.description || "").trim(),
    };
    const resdata = await api.post("/organizations", formattedPayload, {
      token,
    });

    const OrgId = resdata?.data?.data?.id || resdata?.data?.id;
    if (!OrgId) {
      return {
        success: false,
        message: "Organization ID was not returned by API.",
      };
    }

    revalidatePath("/dashboard");
  return {
      success: true,
      message: "Organization created successfully",
      orgId: OrgId,
      redirectUrl: `/${OrgId}/upload-logo`,
    };

  } catch (error) {
    console.error("DEBUG createOrganisationProfile Error:", error);
    if (error.response?.data) {
      console.error("API Error Response Data:", error.response.data);
    }
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to create organisation profile.",
      errors: error.data?.errors || error.data?.data || null,
    };
  }

}

/**
 * رفع شعار المنظمة (Initial Logo)
 */
export async function uploadInitialLogo(imageFile,orgId) {
  let targetRedirectUrl = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

  const targetOrgId = orgId ? String(orgId).trim() : null;
    if (!targetOrgId || targetOrgId === "null" || targetOrgId === "undefined") {
      return {
        success: false,
        message: "No Organisation ID provided.",

      };
    }


    const formData = new FormData();
    formData.append("logo", imageFile);

    const resdata = await api.post(`/organizations/${orgId}/logo`, formData, {
      token,
        headers: {
        "x-organization-id": targetOrgId, // إرسال الـ ID في الهيدر
      },
    });
  console.log("UPLOAD LOGO RESPONSE:", JSON.stringify(resdata, null, 2));
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
