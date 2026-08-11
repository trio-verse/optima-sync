"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";

/**
 * إرسال البريد الإلكتروني لطلب كود OTP
 */
export async function sendEmailToBackend(email) {
  try {
    const resdata = await api.post("/register-email", { email });

    return {
      success: true,
      status: 200,
      message:
        resdata?.data?.message || resdata?.message || "OTP sent successfully",
    };
  } catch (error) {
    console.error("DEBUG sendEmailToBackend Error:", error);
    return {
      success: false,
      status: error.status || 500,
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

    const userToken = resdata?.data?.token || resdata?.token;

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

    return {
      success: true,
      status: 200,
      message: resdata?.message || "OTP verified successfully",
      data: resdata?.data,
    };
  } catch (error) {
    console.error("DEBUG verifyOtp Error:", error);
    return {
      success: false,
      status: error.status || 500,
      message:
        error.data?.message || error.message || "Invalid OTP or network error",
      errors: error.data?.errors || null,
    };
  }
}

// التوافقية مع التسمية القديمة
export const VerifyOtp = verifyOtp;
