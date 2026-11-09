"use server"
import { cookies } from "next/headers";
import { api } from "@/lib/api/client";
import {ApiResponse} from "@/types"
import { TaskStatus, TaskType } from "@/types/workspaceTypes";
export async function CreateTask(orgId:string,workspaceId: string | number,formData: any): Promise<{ success: boolean; message?: string; data?: TaskType }>{
  const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }
if (!workspaceId) {
        return {
            success: false,
            message: "Workspace ID is missing."
        };
    }
try {
        const response = await api.post(
            `/workspaces/${workspaceId}/tasks`,
            {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                status: formData.status,
                assignee_id: formData.assigneeId ? Number(formData.assigneeId) : undefined,
            },
            {
                token,
                headers: {
                    "X-Organization-ID": orgId,
                },
            }
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error: any) {
        console.error("createTask validation error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to create task",
        };
    }

}
export async function UpdateTask(orgId:string,workspaceId: string | number, formData: any ,taskId: string | number,): Promise<{ success: boolean; message?: string; data?: TaskType }>{
        const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }
        if (!workspaceId) {
        return {
            success: false,
            message: "Workspace ID is missing."
        };
    }
    try {
        const response = await api.patch(
            `/workspaces/${workspaceId}/tasks/${taskId}`,
            {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                status: formData.status,
                assignee_id: formData.assigneeId ? Number(formData.assigneeId) : undefined,
            },
            {
                token,
                headers: {
                    "X-Organization-ID": orgId,
                },
            }
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error: any) {
        console.error("updateTask error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to update task"
        };
    }

}
export async function DeleteTask(orgId:string,workspaceId: string | number, 
    taskId: string | number){
  const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }
        if (!workspaceId) {
        return {
            success: false,
            message: "Workspace ID is missing."
        };
    }
    try {
        const response = await api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`, {
            token,
            headers: {
                "X-Organization-ID": orgId,
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error("deleteTask error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Server error while deleting task"
        };
    }

}
export async function getTasks(orgId:string,workspaceId: string | number): Promise<ApiResponse<TaskType[]>>{
      const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }
        if (!workspaceId) {
        return {
            success: false,
            message: "Workspace ID is missing."
        };
    }
    try {
        const response = await api.get(`/workspaces/${workspaceId}/tasks`, {
            token,
            headers: {
                "X-Organization-ID": orgId,
            }
        });

        return {
            success: true,
            data: response.data.data
        };
    } catch (error: any) {
        console.error("getWorkspaceTasks error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to fetch tasks"
        };
    }

}
export async function ChangeStatus(orgId:string,workspaceId: string | number , taskId : number , status:TaskStatus){
   const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }
        if (!workspaceId) {
        return {
            success: false,
            message: "Workspace ID is missing."
        };
    }
        try {
        const response = await api.patch(
            `/workspaces/${workspaceId}/tasks/${taskId}/change-status`,
            {
                status
            },
            {
                token,
                headers: {
                    "X-Organization-ID": orgId,
                },
            }
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error: any) {
        console.error("updateTask error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to change status"
        };
    }

}
export async function ChangeAssignee(orgId:string,workspaceId: string | number , taskId : number , memberId:string){
   const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { success: false, message: "Unauthorized" };
    }

    if (!orgId) {
        return { success: false, message: "Organization ID is missing." };
    }
        if (!workspaceId) {
        return {
            success: false,
            message: "Workspace ID is missing."
        };
    }
        try {
        const response = await api.patch(
            `/workspaces/${workspaceId}/tasks/${taskId}/assign-to-member`,
            {
                member_id:memberId
            },
            {
                token,
                headers: {
                    "X-Organization-ID": orgId,
                },
            }
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error: any) {
        console.error("updateTask error:", error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.data?.message || "Failed to change status"
        };
    }

}