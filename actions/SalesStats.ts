"use server";

import { api } from "@/lib/api/client";
import { SalesStats } from "@/types/SalesStats";
import { cookies } from "next/headers";

export async function getSalesStats(orgId?:string):Promise<{ success: boolean; message?: string; data: SalesStats }>{
   try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data:null };
    }

    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is missing",
        data: null,
      };
    }

    const resdata = await api.get(`/salesStats`, {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    console.log("getSalesStats response **************" , resdata);
     return {
            success: true,
            data: resdata?.data?.data ||null,
        };
    } catch (error) {
        console.error("DEBUG getSalesStats Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to fetch SalesStats",
            data: null,
        };
    }
}