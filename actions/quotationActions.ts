"use server";
import { api } from "@/lib/api/client";
import { cookies } from "next/headers";
import type { QuotationPreviewData, QuotationPdfData } from "@/types/project";
// 1. دالة جلب Preview HTML
export async function previewQuotation(orgId:string, projectId:number, versionId:number): Promise<{ success: boolean; message?: string;html?: string; data?: QuotationPreviewData }> {
    if (!versionId) {
        return { success: false, message: "Version ID is required" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        // نداء الـ Endpoint الجديد مع إرسال رقم المشروع ورقم النسخة
        const response = await api.get(
            `projects/${projectId}/versions/${versionId}/quotations/preview`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                }
            }
        );

        // بناءً على شكل استجابة الباك إند، الـ html موجود داخل data.html
        return { 
            success: true, 
            html: response.data.data.html 
        };
    } catch (error) {
        console.error("Preview Quotation Error:", error);
        return { 
            success: false, 
            message: error?.response?.data?.message || "Failed to fetch quotation preview" 
        };
    }
}

// 2. دالة توليد PDF (والتي ستقوم بعمل Freeze تلقائياً في الباك إند)
// أضف هذه الدالة في نفس ملف quotationActions.js

export async function generateQuotationPdf(orgId:string, projectId:number, versionId:number): Promise<{ success: boolean; message?: string;pdf_url?: string; data?: QuotationPdfData }> {
    if (!versionId) {
        return { success: false, message: "Version ID is required" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        // نداء الـ Endpoint الخاص بتوليد الـ PDF (POST Request)
        const response = await api.post(
            `projects/${projectId}/versions/${versionId}/quotations/generate-pdf`,
            {}, // Body فارغ
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                }
            }
        );

        // إرجاع رابط الـ PDF بناءً على الرد القادم من الباك-إند
        return { 
            success: true, 
            pdf_url: response.data.data.pdf_url 
        };
    } catch (error) {
        console.error("Generate PDF Error:", error);
        return { 
            success: false, 
            message: error?.response?.data?.message || "Failed to generate PDF" 
        };
    }
}