"use client";
import { router, useRouter } from "next/router";
import { useState } from "react"
import sendOtpToEmail from "../actions/registerUser";
import { VerifyOtp } from "../actions/registerUser";
import { AnimatePresence , motion } from "framer-motion";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";

export default function RegisterForm(){
    const [loading, setLoding] = useState(false);
    const [email, setEmail] = useState("");
    const [success, setSuccsess] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState("email");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccsess("");
        
        if (email.length === 0) {
            setError("Email address cannot be empty");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format or contains spaces!");
            return;
        }

        setLoding(true);
        try {
            const result = await sendOtpToEmail(email);
            if (result.success) {
                setSuccsess("We have sent a verification code to your email!");
                setStep("otp");
                
            } else {
                setError(result.message || "Failed to send code. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Check your connection.")
        } finally {
            setLoding(false);

        }


    }
    const slideAnimation={
        initial:{opacity:0 , x:20},
        animate:{opacity:1 , x:0},
        exit:{opacity:0,x:-20},
        transition:{duration:0.5 , ease:"easeInOut"}
    }

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccsess("");
        
        const otpCode = otp.join("");
        if (otpCode.length < 6) {
            setError("Please enter the full code");
            return;
        }

        setLoding(true);
        try {
            const result = await VerifyOtp(email, otpCode);
            setSuccsess("Success! Authenticated.");
        } catch (error) {
            setError("Verification failed. Please try again.")
        } finally {
            setLoding(false);
        }
    }

    return (
        <div aria-description="register-container" className="min-h-lvh flex justify-center items-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-zinc-100 p-4">
            <div aria-description="register-card" className=" w-full max-w-md bg-white/60 flex flex-col items-center justify-center rounded-2xl p-6">
                <div className="text-center w-full mb-6">
                    <h1 className="text-zinc-900 font-extrabold text-3xl tracking-wide mb-2">
                        {step === "email" ? "Sign Up" : "Verify OTP"}
                    </h1>
                    <p className="text-zinc-500 text-xs px-2 leading-relaxed font-medium">
                        Now you do not need a password to access the ERP System. Just enter your email to verify your secure session.
                    </p>
                </div>
                <AnimatePresence mode="wait">
                    {step === "email" ? (
                        <motion.div key="email-step" {...slideAnimation} className="w-full">
                            <EmailStep 
                                email={email} 
                                setEmail={setEmail} 
                                handleEmailSubmit={handleEmailSubmit} 
                                loading={loading}
                                error={error}
                                success={success}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="otp-step" {...slideAnimation} className="w-full">
                            <OtpStep 
                                otp={otp} 
                                setOtp={setOtp} 
                                handleOtpSubmit={handleOtpSubmit} 
                                loading={loading}
                                error={error}
                                success={success}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}