"use server";

import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";
import {api} from "@/lib/api/client";

/**
 * جلب قائمة المنتجات
 */
export async function getProducts(orgId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return {
            success: false,
            message: "Unauthorized",
            data: []
        };


        const resdata = await api.get("/products", {
            token,
            headers: { "X-Organization-ID": orgId },
            cache: "no-store",
        });

        return {
            success: true,
            data: resdata?.data || [],
        };
    } catch (error) {
        console.error("DEBUG getProducts Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to fetch products",
            data: [],
        };
    }
}

/**
 * إنشاء منتج جديد
 */
export async function createProduct(productData, orgId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return {
            success: false,
            message: "Unauthorized"
        };

        const payload = {
            name: productData.name,
            price: productData.price ? Number(productData.price) : 0,
            description: productData.description || "",
        };


        const resdata = await api.post("/products", payload, {
            token,
            headers: { "X-Organization-ID": orgId },
        });

        revalidatePath("/dashboard/products");

        return {
            success: true,
            data: resdata?.data,
            message: resdata?.message || "Product created successfully",
        };
    } catch (error) {
        console.error("DEBUG createProduct Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to create product",
        };
    }
}

/**
 * تعديل منتج
 */
export async function updateProduct(id, productData, orgId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return {
            success: false,
            message: "Unauthorized"
        };

        const payload = {
            name: productData.name,
            price: productData.price ? Number(productData.price) : 0,
            description: productData.description || "",
        };



        const resdata = await api.put(`/products/${id}`, payload, {
            token,
            headers: { "X-Organization-ID": orgId },
        });

        revalidatePath("/dashboard/products");

        return {
            success: true,
            data: resdata?.data,
            message: resdata?.message || "Product updated successfully",
        };
    } catch (error) {
        console.error("DEBUG updateProduct Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to update product",
        };
    }
}

/**
 * حذف منتج
 */
export async function deleteProduct(id, orgId) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return {
            success: false,
            message: "Unauthorized"
        };



        const resdata = await api.delete(`/products/${id}`, {
            token,
            headers: { "X-Organization-ID": orgId },
        });

        revalidatePath("/dashboard/products");

        return {
            success: true,
            data: resdata?.data,
            message: resdata?.message || "Product deleted successfully",
        };
    } catch (error) {
        console.error("DEBUG deleteProduct Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to delete product",
        };
    }
}