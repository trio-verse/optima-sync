"use server";
import { cookies } from "next/headers";
export default async function SendEmailToBackend(email) {
try {
        const response =await fetch("https://optima.trio-verse.com/api/v1/register-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        })
        const resdata = await response.json();
        if (!response.ok) return {
            success: false,
            message: data.message
        }

        return {
            success: true,
            status:response.status,
            message:resdata.data.message
        }
    } catch (error) {
        return {
            success: false,
            status:500,
            message: "Network error"
        }
    }

}
export async function VerifyOtp(email, otpCode) {
    try {
        const response = await fetch("https://optima.trio-verse.com/api/v1/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                otp: otpCode
            })
        });
        const resdata = await response.json();
        if (!response.ok) return {
            success: false,
            message: resdata.message || "Invalid OTP"
        }
        const userToken=resdata?.data?.token;
        if(userToken){
            const cookieStor=await cookies();
            cookieStor.set("token",userToken,{
                path:"/",
                httpOnly:true,
                secure: process.env.NODE_ENV === "production",
                maxAge:60*60*24*7,
                sameSite:"lax"
            })
        }
        return {
            success: true,
            status: response.status,
            message: resdata?.message,


        }
    } catch (error) {
        return {
            success: false,
            message: "Network error"
        }
    }

}