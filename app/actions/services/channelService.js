"use server";

import {cookies} from "next/headers";


export async function createChannel(newName,newColor) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({name: newName, color:newColor})
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata?.data?.message || resdata?.message || "Failed to create city"
            };
        }

        return {
            success: true,
            data: resdata.data,
            id: resdata?.data?.id
        };

    } catch (error) {
        console.error("DEBUG createCity Error", error);
        return {
            success: false,
            message: "An error occurred while connecting to the server"
        };
    }
}


export async function updateChannel(id, newName , newColor) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(``, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: newName,
                color:newColor
            })
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata?.data?.message || resdata?.message || "Failed to update city"
            };
        }

        return {
            success: true,
            data: resdata.data
        };

    } catch (error) {
        console.error("DEBUG updateCity Error", error);
        return {
            success: false,
            message: "An error occurred while connecting to the server"
        };
    }
}


export async function deleteChannel(id) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(``, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata?.data?.message || resdata?.message || "Failed to delete city"
            };
        }

        return {
            success: true,
            data: resdata?.data
        };

    } catch (error) {
        console.error("DEBUG deleteCity Error", error);
        return {
            success: false,
            message: "An error occurred while connecting to the server"
        };
    }
}


export async function getChannels() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch("", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            cache: "no-store"
        });

        const resdata = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resdata?.data?.message || resdata?.message || "Failed to fetch cities"
            };
        }

        return {
            success: true,
            data: resdata?.data
        };
    } catch (error) {
        console.error("DEBUG getCity Error", error);
        return {
            success: false,
            message: "An error occurred while connecting to the server"
        };
    }
}