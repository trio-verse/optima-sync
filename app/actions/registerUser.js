

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
        const data = await response.json();
        if (!response.ok) return {
            success: false,
            message: data.message
        }
        return {
            success: true,
            status:response.status,
            message:data.message
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
        return {
            success: true,
            status: response.status,
            message: resdata.status,
            token:resdata?.data.token || resdata.token

        }
    } catch (error) {
        return {
            success: false,
            message: "Network error"
        }
    }

}