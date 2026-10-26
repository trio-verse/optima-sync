"use server";

import { api } from "@/lib/api/client";

export interface CreateProjectRequestBody {
  name: string;
  phone: string;
  email?: string;
  title: string;
  description: string;
  attachments?: Record<string, unknown> | File | FormData;
}

export async function sendProjectRequest(
  token: string,
  orgId: string,
  bodyData: CreateProjectRequestBody,
) {
  try {
    const response = await api.post(`/${token}/project-request`, bodyData, {
      headers: {
        "X-Organization-Id": orgId,
      },
    });
    console.log("Project request response:", response);
    if (response.status >= 400) {
      return {
        success: false,
        message:
          (response.data as { message?: string })?.message ||
          "Failed to submit project request.",
      };
    }

    const resData = response.data as {
      success?: boolean;
      message?: string;
      data?: unknown;
    };

    return {
      success: resData?.success ?? true,
      message: resData?.message || "Project request created successfully",
      data: resData?.data ?? null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit project request.",
    };
  }
}
export async function generateProjectToken(orgId: string, Token: string) {
    const t2 = Date.now();
    console.log("server start ", t2);
  try {
    const response = await api.get(`/organizations/get-token`, {
      headers: {
        "X-Organization-Id": orgId,
      },
      token: Token,
      cache: "no-store",
    });
    const t4 = Date.now();
    console.log("server finish ", t4);
    if (response.status >= 400) {
      return {
        success: false,
        message:
          (response.data as { message?: string })?.message ||
          "Failed to generate project token.",
      };
    }
    const resData = response.data as {
      success?: boolean;
      data?: string;
      message?: string;
    };
    return {
      success: resData?.success ?? true,
      data: resData?.data,
      message: resData?.message || "Project token generated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to generate project token.",
    };
  }
}

// export async function trackProjectStatus(referenceNumber) {
//     if (!referenceNumber || !referenceNumber.trim()) {
//         return {
//             success: false,
//             message: "Please enter a valid reference number.",
//         };
//     }

//     try {
//         const resdata = await api.get(`/projects/status`, {
//             params: {
//                 reference_number: referenceNumber.trim(),
//             },
//             cache: "no-store",
//         });

//         return {
//             success: true,
//             data: resdata?.data?.data || resdata?.data,
//             message: resdata?.data?.message || "Project status retrieved successfully!",
//         };
//     } catch (error) {
//         console.error("Error tracking project status:", error);
//         return {
//             success: false,
//             message: error.data?.message || error.message || "Failed to fetch project status. Please try again later.",
//         };
//     }
// }

export async function freezeProjectVersion(orgId: string, vId: number) {
  try {
    const response = await api.post(`/project/freeze`, { vId }, {
      headers: {
        "X-Organization-Id": orgId,
      },
    });

    if (response.status === 200 || response.status === 404) {
      return { success: true };
    }

    return { success: true, data: response.data };
  } catch (error: any) {

    const status = error?.response?.status || error?.status;
    if (status === 200 || status === 404) {
      return { success: true };
    }


    console.warn("Freeze request skipped/ignored due to network or server response:", error?.message);
    return { success: false, message: error?.message };
  }
}