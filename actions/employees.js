"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api/client";

export async function getEmployees(orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized", data: [] };
    if (!orgId) {
      return { success: false, message: "Organization ID is missing.", data: [] };
    }

    const response = await api.get("/hr/employees", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });

    return {
      success: true,
      message: response?.data?.message || "Employees retrieved successfully",
      data: Array.isArray(response?.data?.data) ? response.data.data : [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.data?.message || "Unable to load employees.",
      data: [],
    };
  }
}

export async function createEmployee(formData, orgId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };
    if (!orgId) return { success: false, message: "Organization ID is missing." };

    const payload = {
      name: String(formData.name || "").trim(),
      email: String(formData.email || "").trim(),
      phone: String(formData.phone || "").trim(),
      position: String(formData.position || "").trim(),
      cost_per_hour: String(formData.cost_per_hour || "").trim(),
      houres_per_point: String(formData.houres_per_point || "").trim(),
      organization_id: Number(orgId),
    };

    const response = await api.post("/hr/employees", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    revalidatePath(`/${orgId}/dashboard/workspace`);

    return {
      success: true,
      message: response?.data?.message || "Employee created successfully",
      data: response?.data?.data || response?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.data?.message || "Unable to create employee.",
      errors: error.data?.errors || null,
    };
  }
}


export async function getProjectEmployees(projectId, orgId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const res = await api.get(`/projects/${projectId}/employees`, {
            token,
            headers: {
                "X-Organization-Id": orgId
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching project employees:", error);
        throw error;
    }
}

// إضافة موظف إلى المشروع
export async function createProjectEmployee(projectId, orgId, payload) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const res = await api.post(`/projects/${projectId}/employees`, payload, {
          token,
            headers: {
                "X-Organization-Id": orgId
            }
        });
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

// تعديل موظف في المشروع
export async function updateProjectEmployee(projectId, memberId, orgId, payload) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const res = await api.put(`/projects/${projectId}/employees/${memberId}`, payload, {
          token,
            headers: {
                "X-Organization-Id": orgId
            }
        });
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

// حذف موظف من المشروع
export async function deleteProjectEmployee(projectId, memberId, orgId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const res = await api.delete(`/projects/${projectId}/employees/${memberId}`, {
          token,
            headers: {
                "X-Organization-Id": orgId
            }
        });
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}