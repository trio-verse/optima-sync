"use server";

import { cookies } from "next/headers";

export async function createCity(newName, newColor) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(
      "https://optima.trio-verse.com/api/v1/cities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          color: newColor,
        }),
      },
    );

    const resdata = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          resdata?.data?.message || resdata?.message || "Failed to create city",
      };
    }

    return {
      success: true,
      data: resdata.data,
      id: resdata?.data?.id,
    };
  } catch (error) {
    console.error("DEBUG createCity Error", error);
    return {
      success: false,
      message: "An error occurred while connecting to the server",
    };
  }
}

export async function updateCity(id, newName, newColor) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(
      `https://optima.trio-verse.com/api/v1/cities/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          color: newColor,
        }),
      },
    );

    const resdata = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          resdata?.data?.message || resdata?.message || "Failed to update city",
      };
    }

    return {
      success: true,
      data: resdata.data,
    };
  } catch (error) {
    console.error("DEBUG updateCity Error", error);
    return {
      success: false,
      message: "An error occurred while connecting to the server",
    };
  }
}

export async function deleteCity(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(
      `https://optima.trio-verse.com/api/v1/cities/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const resdata = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          resdata?.data?.message || resdata?.message || "Failed to delete city",
      };
    }

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG deleteCity Error", error);
    return {
      success: false,
      message: "An error occurred while connecting to the server",
    };
  }
}

export async function getCity() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(
      "https://optima.trio-verse.com/api/v1/cities",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const resdata = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          resdata?.data?.message ||
          resdata?.message ||
          "Failed to fetch cities",
      };
    }

    return {
      success: true,
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG getCity Error", error);
    return {
      success: false,
      message: "An error occurred while connecting to the server",
    };
  }
}
