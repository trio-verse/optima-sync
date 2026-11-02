import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types";
import { WorkSpace } from "@/types/workspaceTypes";

/**
 * Fetch list of workspaces
 */
export async function getWorkspaces(orgId?:string):Promise<ApiResponse<WorkSpace[]>> {
  try {
    if (!orgId) {
      return { success: false, message: "Organization ID is missing." };
    }
    const resdata = await api.get("/workspace", {
      headers: orgId ? { "X-Organization-ID": orgId } : {},
      cache: "no-store",
    });
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