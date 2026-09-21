"use server";
import {
    api
} from "@/lib/api/client";
import { cookies } from "next/headers";


export async function getProjectEmployees(projectId, orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    try {
        const response = await api.get(`projects/${projectId}/employees`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": orgId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching project employees:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function createProjectEmployee(projectId, orgId, employeeData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    try {
        const response = await api.post(
            `projects/${projectId}/employees`,
            employeeData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );
        return response.data;
    } catch (error) {
        // 💡 الحل البديل: استخراج الأخطاء هنا قبل إرسالها للواجهة
        let errorMessage = "حدث خطأ غير معروف في الخادم.";
        
        // client.js يضع استجابة الباك إند داخل error.data
        if (error?.data?.errors) {
            errorMessage = Object.values(error.data.errors).flat().join("\n");
        } else if (error?.data?.message) {
            errorMessage = error.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        console.error("Create Employee Error:", errorMessage);
        throw new Error(errorMessage); // رمي رسالة نصية نقية لا يرفضها Next.js
    }
}

export async function updateProjectEmployee(projectId, employeeId, orgId, employeeData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    try {
        const response = await api.patch(
            `projects/${projectId}/employees/${employeeId}`,
            employeeData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );
        return response.data;
    } catch (error) {
        let errorMessage = "حدث خطأ غير معروف في الخادم.";
        
        if (error?.data?.errors) {
            errorMessage = Object.values(error.data.errors).flat().join("\n");
        } else if (error?.data?.message) {
            errorMessage = error.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        console.error("Update Employee Error:", errorMessage);
        throw new Error(errorMessage);
    }
}


export async function deleteProjectEmployee(projectId, employeeId, orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    try {
        const response = await api.delete(`projects/${projectId}/employees/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": orgId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting project employee:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}