
export const renderChangeEmailHtml = (
  fullname: string,
  newEmail: string,
  verifyLink: string,
) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f4f4f4; padding: 40px;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 3px 8px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #007bff; margin: 0;">📧 Confirm Email Change</h2>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
          Hello, ${fullname}
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          We received a request to change the email address on your account to:
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; text-align:center;">
          <b>${newEmail}</b>
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          If this was you, please confirm the change by clicking the button below:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" 
            style="
              display: inline-block;
              background: #007bff;
              color: white;
              text-decoration: none;
              font-size: 15px;
              padding: 12px 25px;
              border-radius: 8px;
            ">
            Confirm Email Change
          </a>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.6;">
          ⚠️ This link will expire in <b>15 minutes</b>. If you do not confirm within this time, you will need to submit a new request.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #888; text-align: center;">
          If you didn't request to change your email, you can safely ignore this message. Your account email will remain unchanged.<br/>
          © ${new Date().getFullYear()} ANT. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
