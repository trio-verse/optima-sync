"use server";
import { api } from "@/lib/api/client";
import { cookies } from "next/headers";

// 1. دالة جلب Preview HTML
export async function previewQuotation(projectId, orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    try {
        const response = await api.get(`projects/${projectId}/quotation/preview`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": orgId,
            }
        });
        return { success: true, html: response.data.html || response.data };
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || "Failed to preview quotation" };
    }
}

// 2. دالة توليد PDF (والتي ستقوم بعمل Freeze تلقائياً في الباك إند)
export async function generateQuotationPdf(projectId, orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    try {
        const response = await api.post(`projects/${projectId}/quotation/generate-pdf`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": orgId,
            }
        });
        // الباك إند يجب أن يرجع رابط الـ PDF (مثلاً pdf_url)
        return { success: true, pdf_url: response.data.pdf_url };
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || "Failed to generate PDF" };
    }
}