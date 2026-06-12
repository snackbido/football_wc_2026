import nodemailer from "nodemailer";

/**
 * Tạo transporter Nodemailer từ biến môi trường
 */
const createTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Thiếu cấu hình email (EMAIL_HOST, EMAIL_USER, EMAIL_PASS) trong .env"
    );
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465, // true nếu dùng SSL port 465
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

/**
 * Gửi token đăng ký đến email người dùng
 * @param toEmail  Địa chỉ email nhận
 * @param toName   Tên hiển thị người nhận
 * @param token    Token dạng WC2026-XXXXXX
 */
export const sendTokenEmail = async (
  toEmail: string,
  toName: string,
  token: string
): Promise<void> => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"WC2026 Football App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🏆 Mã Token Đăng Ký WC2026 Của Bạn",
    html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
          .container { max-width:560px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,.1); }
          .header { background:linear-gradient(135deg,#1a3c6e,#c0392b); padding:30px 20px; text-align:center; }
          .header h1 { color:#fff; margin:0; font-size:26px; letter-spacing:1px; }
          .header p  { color:#f8d56b; margin:5px 0 0; font-size:13px; }
          .body { padding:30px 35px; }
          .token-box { background:#f0f4ff; border:2px dashed #1a3c6e; border-radius:8px; text-align:center; padding:20px; margin:25px 0; }
          .token-box .label { font-size:13px; color:#666; margin-bottom:8px; }
          .token-box .token { font-size:28px; font-weight:bold; color:#1a3c6e; letter-spacing:3px; }
          .note { font-size:13px; color:#777; line-height:1.6; }
          .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚽ WC2026 Football App</h1>
            <p>World Cup 2026 Prediction Platform</p>
          </div>
          <div class="body">
            <p>Xin chào <strong>${toName}</strong>,</p>
            <p>Bạn vừa đăng ký tài khoản trên hệ thống <strong>WC2026</strong>. Đây là mã token của bạn:</p>
            <div class="token-box">
              <div class="label">TOKEN ĐĂNG NHẬP CỦA BẠN</div>
              <div class="token">${token}</div>
            </div>
            <p class="note">
              ⚠️ <strong>Lưu ý:</strong> Dùng token này để xác thực mỗi lần đăng nhập.
              Không chia sẻ token cho bất kỳ ai.
              Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.
            </p>
          </div>
          <div class="footer">© 2026 WC2026 Football App · Email tự động, vui lòng không trả lời.</div>
        </div>
      </body>
      </html>
    `,
  });

  console.log(`[EmailService] ✅ Đã gửi token đến: ${toEmail}`);
};
