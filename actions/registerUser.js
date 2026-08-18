"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";

/**
 * إرسال البريد الإلكتروني لطلب كود OTP
 */
export async function sendEmailToBackend(email) {
  try {
    const resdata = await api.post("/register-email", { email });


const result = {
      status: resdata?.status,
      data: resdata?.data,
    };

    return {
      success: true,
      status: Number(result.status),
      message:
      result?.data?.message || resdata?.message || "OTP sent successfully",
    };
  } catch (error) {
    console.error("DEBUG sendEmailToBackend Error:", error);
    return {
      success: false,
      status: Number(error.status || 500),
      message: error.data?.message || error.message || "Network error",
      errors: error.data?.errors || null,
    };
  }
}

// التوافقية مع الاستيراد الافتراضي القديم
export default sendEmailToBackend;

/**
 * التحقق من كود الـ OTP وحفظ التوكن في الكوكيز
 */
export async function verifyOtp(email, otpCode) {
  try {
    const resdata = await api.post("/verify-otp", {
      email,
      otp: otpCode,
    });

  const userToken = resdata?.data?.data?.token || resdata?.data?.token;

  const result = {
      status: resdata?.status,
      data: resdata?.data?.data,
    };

    if (userToken) {
      const cookieStore = await cookies();
      cookieStore.set("token", userToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 أيام
        sameSite: "lax",
      });
    }


    console.log(result,"jjjjjjjjjjjjjj")
    return {
      success: true,
      status: Number(result.status),
      message: result?.data?.message || "OTP verified successfully",
      data: result?.data?.data,
    };
    
  } catch (error) {
    console.error("DEBUG verifyOtp Error:", error);

  const result = {
      status: error.status || 500,
      data: error.data || {},
    };
    return {
      success: false,
      status:Number(result.status),
      message:
      result.data?.message || error.message || "Invalid OTP or network error",
      errors: result.data?.errors || null,
    };
  }
}

// التوافقية مع التسمية القديمة
export const VerifyOtp = verifyOtp;
