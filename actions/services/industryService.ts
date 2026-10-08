"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api, getErrorMessage, getStatusMessage } from "@/lib/api/client";
import type { Industry, CreateIndustryDTO } from "@/types/reference";

export async function getindustries(
  orgId?: string,
): Promise<{ success: boolean; message?: string; data: Industry[] }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/industries", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to fetch industries"),
        ),
        data: [],
      };
    }
    return {
      success: true,
      data: resdata?.data?.data || [],
    };
  } catch (error) {
    console.error("DEBUG getIndustry Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch industries"),
      data: [],
    };
  }
}

export async function createIndustry(
  newName: string,
  newColor: string,
  orgId?: string,
): Promise<{
  success: boolean;
  message?: string;
  data?: Industry;
  id?: number;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload:CreateIndustryDTO= {
      name: newName,
      color: newColor,
    };

    const resdata = await api.post("/industries", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to create industry"),
        ),
      };
    }

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
      id: resdata?.data?.data.id,
    };
  } catch (error) {
    console.error("DEBUG createIndustry Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to create industry"),
    };
  }
}

export async function updateIndustry(
  id: number,
  newName: string,
  newColor: string,
  orgId?: string,
): Promise<{ success: boolean; message?: string; data?: Industry }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload:CreateIndustryDTO = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.patch(`/industries/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to update industry"),
        ),
      };
    }

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateIndustry Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update industry"),
    };
  }
}

export async function deleteIndustry(
  id: number,
  orgId?: string,
): Promise<{ success: boolean; message?: string; data?: Industry }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/industries/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to delete industry"),
        ),
      };
    }

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteIndustry Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete industry"),
    };
  }
}
