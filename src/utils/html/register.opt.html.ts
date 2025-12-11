



export const renderRegisterOtpHtml = (otpCode: string, fullname: string) => {
    return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f4f4f4; padding: 40px;">
                <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 3px 8px rgba(0,0,0,0.05);">
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #007bff; margin: 0;">🔐 Email Verification</h2>
                </div>

                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                    Hello, ${fullname}
                </p>

                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                    Thank you for signing up! Please use the OTP code below to verify your email address.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background: #007bff; color: white; font-size: 24px; letter-spacing: 4px; padding: 12px 25px; border-radius: 8px;">
                    ${otpCode}
                    </div>
                </div>

                <p style="font-size: 14px; color: #555; line-height: 1.6;">
                    ⚠️ This code will expire in <b>5 minutes</b>. Please do not share it with anyone.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="font-size: 13px; color: #888; text-align: center;">
                    If you didn't request this, you can safely ignore this email.<br/>
                    © ${new Date().getFullYear()} ANT. All rights reserved.
                </p>
                </div>
            </div>
            `;
}  