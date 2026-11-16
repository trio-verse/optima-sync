"use server";
import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types";
import { WorkSpace, WorkSpaceStatus, WorkspaseState } from "@/types/workspaceTypes";
import { cookies } from "next/headers";

export interface GetWorkspacesParams {
  status?: string;
  search?: string;
  deadline_from?: string;
  deadline_to?: string;
  sort?: string;
  direction?: string;
  per_page?: number;
} 

/**
 * Fetch list of workspaces
 */
export async function getWorkspaces(orgId?:string, params?: GetWorkspacesParams):Promise<ApiResponse<WorkSpace[]>> {
  try {
    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const resdata = await api.get("/workspaces", {
      headers: orgId ? { "X-Organization-ID": orgId } : {},
      params: params as Record<string,any>,
      cache: "no-store",
    });
    console.log(resdata?.data?.data)
    return {
      success: true,
      message: "workspaces data fetched successfully.",
      data: resdata?.data?.data  || [],
      meta: resdata?.data?.meta || {},
    };
  } catch (error) {
    console.error("DEBUG get workspaces Error:", error);
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while fetching workspaces.",
      data: [],
    };
  }
}
/**
 * Create a new workspace 
 */
export async function createWorkspace(formData:WorkSpace , orgId?: string): Promise<ApiResponse< WorkSpace>> {
  try {
    console.log("####",formData );
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    const resdata = await api.post(`/workspaces`, formData, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    return {
      success: true,
      message: resdata?.data?.message ,
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to add workspace",
      errors: error.data?.errors || null,
    };
  }
}
/**
 * Update workspace 
 */
export async function updateWorkspace(workspace_id: number ,formData:WorkSpace ,orgId?: string ): Promise<ApiResponse< WorkSpace>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    if (!workspace_id) {
      return { success: false, message: "Workspace ID is missing" };
    }

    const resdata = await api.patch(
      `/workspaces/${workspace_id}`,
      formData,
      { 
        token,
        headers: { "X-Organization-ID": orgId } 
      }
    );
    console.log(resdata);
    return {
      success: resdata?.data?.success ?? true,
      message: resdata?.data?.message || "Workspace updated successfully",
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to update workspace",
      errors: error.data?.errors || null,
    };
  }
}
/**
 * Delete workspace 
 */
export async function deleteWorkspace(workspace_id:number, orgId?:string):Promise<ApiResponse< WorkSpace>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing" };
    }

    if (!workspace_id) {
      return { success: false, message: "Workspace ID is missing" };
    }

    const resdata = await api.delete(
      `/workspaces/${workspace_id}`,
      { 
        token, 
        headers: { "X-Organization-ID": orgId } 
      }
    );


    return {
      success: true,
      data: resdata?.data?.data || resdata?.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "Failed to delete workspace",
    };
  }
}

/**
 * Change workspace status workspace 
 */
export async function changeWorkspaceStatus(workspace_id:string , status:WorkSpaceStatus, orgId?:string) :Promise<ApiResponse<WorkSpaceStatus>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }

    const res = await api.patch(
       `/workspaces/${workspace_id}`,
      { status },
      {
        token,
        headers: { "X-Organization-ID": orgId },
        cache: "no-store",
      }
    );


    return {
      success: true,
      message: res?.data?.message || res?.data.message || "Workspace status changed successfully",
      data: res?.data?.data || res?.data,
    };
  } catch (error) {
    return {
      success: false,
      errors: error?.data?.message || error?.message || "Failed to update status",
    };
  }
}

export async function getWorkspacesStats(orgId?:string):Promise<ApiResponse<WorkspaseState>> {
  try {
    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const resdata = await api.get("/workspaces/stats", {
      headers: orgId ? { "X-Organization-ID": orgId } : {},
      cache: "no-store",
    });
    return {
      success: true,
      message: "workspaces stats fetched successfully.",
      data: resdata?.data?.data  ,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.data?.message ||
        error.message ||
        "An error occurred while fetching workspaces.",
      data: null,
    };
  }
}