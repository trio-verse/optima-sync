"use client"
import { use, useEffect, useRef } from "react";
import { useState } from "react";
export default function OtpStep({ otp, setOtp, error, handleOtpSubmit, success, loading, onBackToSignup }) {
    const [timeLeft, setTimeLeft] = useState(300);
    const otpRefs = useRef([]);
    useEffect(() => {

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1
            })
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const formatTime = (secounds) => {
        const mins = Math.floor(secounds / 60);
        const secs = secounds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    const isExpired = timeLeft === 0;
    const handleOtpChange = (value, index) => {
        if (value !== "" && !/^[0-9]$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    }
    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);

                otpRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    }
    return (
        <form onSubmit={handleOtpSubmit} className="flex flex-col w-full gap-4" noValidate>
            <div>
                <label className="text-zinc-700 font-semibold flex flex-col mb-3">Enter verification code :</label>
                <div className="flex justify-center gap-3">
                    {otp.map((value, index) => (
                        <input
                            className="bg-white border border-zinc-200 w-12 h-12 text-center text-zinc-900 font-bold text-lg rounded-xl outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm "
                            key={index}
                            type="text"
                            maxLength={1}
                            value={value}
                            ref={(el) => (otpRefs.current[index] = el)}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isExpired ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"}`}>
                        {isExpired ? "Expired" : formatTime(timeLeft)}
                    </span>
                </div>

            </div>
            {error && <p className="text-rose-500 text-xs font-semibold">{error}</p>}
            {success && <p className="text-emerald-500 text-xs font-semibold">{success}</p>}
            <button className="bg-blue-500 hover:bg-blue-700 font-bold py-3 rounded-xl text-sm transition-all duration-300 text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading || isExpired}>
                {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button type="button" onClick={onBackToSignup} className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold underline underline-offset-4 transition-colors text-center mt-1"> Wrong email or code expired? Back to Sign Up</button>
        </form>
    )
}