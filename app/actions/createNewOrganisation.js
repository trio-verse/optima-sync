"use server";
import { cookies } from "next/headers";

export async function createOrganisationProfile(formDataPayload) {
  try {
    const cookieStore = await cookies();
    //cookieStore.delete("organizationId");
    const token = cookieStore.get("token")?.value;
    const formattedPayload = {
      name: String(formDataPayload.name || "").trim(),
      email: String(formDataPayload.email || "").trim(),
      phone: String(formDataPayload.phone_number || "").trim(),
      phone_number: String(formDataPayload.phone_number || "").trim(), 
      address: String(formDataPayload.address || "").trim(),
      description: String(formDataPayload.description || "").trim(),
    };

    const response = await fetch(
      "https://optima.trio-verse.com/api/v1/organizations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedPayload),
      }
    );

    const resdata = await response.json();
console.log("FULL API RESPONSE:", JSON.stringify(resdata, null, 2))

    if (!response.ok) {
      const validationDetails = resdata?.errors || resdata?.data || null;
      return {
        success: false,
        message: resdata?.message || "Failed to create organisation profile.",
        errors: validationDetails
      };
    }


    const rawOrgId = resdata?.data?.id ;

    if (rawOrgId) {
      const newOrgId = String(rawOrgId); 


    cookieStore.set("organizationId", newOrgId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",          
  });

      console.log("SUCCESS: Organization ID saved to cookie:", newOrgId);
    } else {
      console.error("WARNING: Could not find Organization ID in response!", resdata);
    }

    return {
      success: true,
      data: resdata?.data,
      id: rawOrgId,
    };
  } catch (error) {
    console.error("DEBUG Server Action Error", error);
    
    return {
      success: false,
      message: "An error occurred while connecting to the server.",
    };
  }
}

export async function uploadInitialLogo(imageFile) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const orgId = cookieStore.get("organizationId")?.value;

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID not found in cookies",
      };
    }

    const formData = new FormData();
    formData.append("logo", imageFile);

    const response = await fetch(
      `https://optima.trio-verse.com/api/v1/organizations/${orgId}/logo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const resdata = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resdata?.data?.message || resdata?.message || "Failed to upload logo.",
      };
    }

    return {
      success: true,
      logo_url: resdata?.data?.logo_url || resdata?.logo_url,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while uploading the logo.",
    };
  }
}