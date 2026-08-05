"use server";
const API_BASE_URL = "https://optima.trio-verse.com/api/v1";

import { cookies } from "next/headers";
export async function creatIndustry(newName, newColor) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    const response = await fetch(`${API_BASE_URL}/industries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, color: newColor }),
    });
    const resdata = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: resdata.data.message,
      };
    }

    return {
      success: true,
      data: resdata.data,
      id: resdata?.data.id,
    };
  } catch (error) {
    console.error("DEBUG server Action Error ", error);
    return {
      success: false,
      message: "An error occurred while connecting to the server",
    };
  }
}
export async function updateIndustry(id, newName, newColor) {
  const storCookies = await cookies();
  const token = storCookies.get("token")?.value;
  try {
    const response = await fetch(`${API_BASE_URL}/industries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, color: newColor }),
    });

    const resdata = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: resdata?.data.message,
      };
    }
    return {
      success: true,
      data: resdata.data,
    };
  } catch (error) {
    console.error("DEBUG updateIndustry Error", error);
    return {
      success: false,
      message: "An error while connecting the server",
    };
  }
}

export async function deleteIndustry(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const response = await fetch(`${API_BASE_URL}/industries/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resdata = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: resdata?.data.message,
      };
    }
    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG delete Industry Error", error);
    return {
      success: false,
      message: "error while connecting to server",
    };
  }
}
export async function getIndustry() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const response = await fetch(`${API_BASE_URL}/industries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const resdata = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: resdata?.data.message,
      };
    }
    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG getIndustry Error", error);
    return {
      success: false,
      message: "error while connicting the server",
    };
  }
}
