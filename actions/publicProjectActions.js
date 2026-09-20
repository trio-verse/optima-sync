"use server";

import { api } from "@/lib/api/client";


export async function getPublicIntakeUrl(token) {
    try {

        const resdata = await api.get(`/public-intake/${token}`, {
            cache: "no-store",
        });

        return {
            success: true,
            endpoint: resdata?.data?.submit_url || `/api/v1/projects/public-intake/${token}`,
        };
    } catch (error) {
        console.error("Error fetching intake URL:", error);
        return {
            success: false,
            endpoint: `/api/v1/projects/public-intake/${token}`,
        };
    }
}


export async function submitPublicProject(targetUrl, formData) {
    try {

        const resdata = await api.post(targetUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            success: true,
            data: resdata?.data?.data,
            message: resdata?.data?.message || "Project request submitted successfully!",
        };
    } catch (error) {
        console.error("Error submitting public project:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to submit project request",
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

