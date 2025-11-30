import { Resend } from "resend";

// Lazy initialization to avoid build errors
let resend: Resend | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendOtpEmail(email: string, code: string) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Tạp Hoá Game";
  const resendClient = getResend();

  if (!resendClient) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: `${appName} <noreply@${process.env.RESEND_DOMAIN || "resend.dev"}>`,
      to: email,
      subject: `[${appName}] Mã xác thực của bạn: ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 400px; margin: 0 auto; background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; border: 1px solid #333;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #00ff88; font-size: 24px; margin: 0;">🎮 ${appName}</h1>
            </div>
            
            <p style="color: #ccc; margin-bottom: 24px; text-align: center;">
              Nhập mã bên dưới để hoàn tất xác thực tài khoản:
            </p>
            
            <div style="background: #000; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00ff88;">
                ${code}
              </span>
            </div>
            
            <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 16px;">
              Mã này sẽ hết hạn sau <strong style="color: #fff;">5 phút</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send OTP email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
