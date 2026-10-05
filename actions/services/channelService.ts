"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api ,   getErrorMessage, getStatusMessage} from "@/lib/api/client";
import type { Channel , CreateChannelDTO  } from "@/types/reference";

export async function getChannels(orgId?:string): Promise<{ success: boolean; message?: string; data: Channel[] }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const resdata = await api.get("/channels", {
      token,
      headers: { "X-Organization-ID": orgId },
      cache: "no-store",
    });
    if (resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to fetch channels")
        ),  
        data: [],
      };
    }

    return {
      success: true,
      data: resdata?.data?.data || [],
    };
  } catch (error) {
    console.error("DEBUG getChannels Error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch channels"),
      data: [],
    };
  }
}


export async function createChannel(newName: string, newColor: string, orgId?: string): Promise<{
  success: boolean;
  message?: string;
  data?: Channel;
  id?: number;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload:CreateChannelDTO = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.post("/channels", payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });
    if(resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to create channel")
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
    console.error("DEBUG createChannel Error:", error);
    return {
      success: false,
      message:getErrorMessage(error , "Failed to create channel"),
    };
  }
}


export async function updateChannel(id: number, newName: string, newColor: string, orgId?: string): Promise<{ success: boolean; message?: string; data?: Channel }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const payload: CreateChannelDTO = {
      name: newName,
      color: newColor,
    };

    const resdata = await api.patch(`/channels/${id}`, payload, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if(resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to update channel")
        ),
      };
    }

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG updateChannel Error:", error);
    return {
      success: false,
      message:getErrorMessage(error , "Failed to update channel"),
    };
  }
}


export async function deleteChannel(id: number, orgId?: string): Promise<{ success: boolean; message?: string; data?: Channel }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const resdata = await api.delete(`/channels/${id}`, {
      token,
      headers: { "X-Organization-ID": orgId },
    });

    if(resdata.status >= 400) {
      return {
        success: false,
        message: getStatusMessage(
          resdata.status,
          getErrorMessage(resdata.data, "Failed to delete channel")
        ),
      };
    }

    revalidatePath("/dashboard/clients");

    return {
      success: true,
      data: resdata?.data?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteChannel Error:", error);
    return {
      success: false,
      message:getErrorMessage(error , "Failed to delete channel"),
    };
  }
}