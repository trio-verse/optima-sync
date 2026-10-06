"use server";

import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";
import {api , getErrorMessage , getStatusMessage} from "@/lib/api/client";
import type { CreateProductDTO, Product } from "@/types/reference";

export async function getProducts(orgId?:string): Promise<{ success: boolean; message?: string; data: Product[] }> {
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
        if(resdata.status >= 400){
            return {
                success: false,
                message: getStatusMessage(resdata.status,
                    getErrorMessage(resdata, "Failed to fetch products")),
                data: []
            };
        }
        var d: Product[] = resdata?.data?.data;
        console.log(d);
        return {
            success: true,
            data: resdata?.data?.data as Product[]|| [],
        };
    } catch (error) {
        console.error("DEBUG getProducts Error:", error);
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch products"),
            data: [],
        };
    }
}


export async function createProduct(productData: Omit<Product, "id">, orgId?: string): Promise<{ success: boolean; message?: string; data?: Product }> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return {
            success: false,
            message: "Unauthorized"
        };

        const payload:CreateProductDTO = {
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
            data: resdata?.data?.data,
            message: resdata?.data?.message || "Product created successfully",
        };
    } catch (error) {
        console.error("DEBUG createProduct Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to create product",
        };
    }
}

export async function updateProduct(id: number, productData: Partial<Product>, orgId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return {
            success: false,
            message: "Unauthorized"
        };

        const payload :CreateProductDTO = {name: "", price: 0, description: ""};
        if (productData.name !== undefined) payload.name = productData.name;
        if (productData.price !== undefined) payload.price = Number(productData.price);
        if (productData.description !== undefined) payload.description = productData.description;



        const resdata = await api.put(`/products/${id}`, payload, {
            token,
            headers: { "X-Organization-ID": orgId },
        });

        revalidatePath("/dashboard/products");

        return {
            success: true,
            data: resdata?.data?.data,
            message: resdata?.data?.message || "Product updated successfully",
        };
    } catch (error) {
        console.log("=== BACKEND VALIDATION ERROR DETAILS ===");
    console.log("Status Code:", error.response?.status);
    console.log("Response Data:", JSON.stringify(error.response?.data, null, 2));
    console.log("========================================");

        return {
            success: false,
            message: error.data?.message || error.message || "Failed to update product",
        };
    }
}


export async function deleteProduct(id: number, orgId?: string) {
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
            data: resdata?.data?.data,
            message: resdata?.data?.message || "Product deleted successfully",
        };
    } catch (error) {
        console.error("DEBUG deleteProduct Error:", error);
        return {
            success: false,
            message: error.data?.message || error.message || "Failed to delete product",
        };
    }
}