"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api , getErrorMessage, getStatusMessage} from "@/lib/api/client";
import type { City , CreateCityDTO  } from "@/types/reference";

export async function getcities(orgId?:string): Promise<{ success: boolean; message?: string; data: City[] }> {
    try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/cities", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
      if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to fetch cities")
        ),
        data: [],
      };
    }
    return {
      success: true,
      data: resdata?.data?.data || [],
    };
  } catch (error) {
    console.error("DEBUG getCity Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch cities"),
      data: [],
    };
  }
}


export async function createCity(newName:string, newColor:string,orgId?:string): Promise<{ success: boolean; message?: string; data?: City; id?: number }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload: CreateCityDTO = {
      name: newName,
      color: newColor,
    };


    const resdata = await api.post("/cities", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });
    
     if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to create city")
        ),
      };
    } 

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
      id: resdata?.data?.data.id,
    };
  } catch (error) {
    console.error("DEBUG createCity Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to create city"),
    };
  }
}


export async function updateCity(id:number, newName:string, newColor:string,orgId?:string): Promise<{ success: boolean; message?: string; data?: City }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload: CreateCityDTO = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.patch(`/cities/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });
    if(resdata.status >= 400) {
      return{
        success: false,
        message: getStatusMessage(
          resdata.status,  
        getErrorMessage(resdata.data, "Failed to update city")
        ),
      }
    }  

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateCity Error:", error);
    return {
      success: false,
      message:  getErrorMessage(error, "Failed to update city"),
    };
  }
}


export async function deleteCity(id:number,orgId?:string): Promise<{ success: boolean; message?: string; data?: City }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/cities/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if(resdata.status >= 400) {
      return{
        success:false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to delete city")
        ),
      }
    }
    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteCity Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete city"),
    };
  }
}
