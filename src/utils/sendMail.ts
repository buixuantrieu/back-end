import nodemailer from "nodemailer";
const sendMail = async (email: string, htmlContent: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mingsuhomestay@gmail.com",
        pass: process.env.PASSWORD_APP,
      },
    });

    const mailOptions = {
      from: '"Good Doctor Auth" <mingsuhomestay@gmail.com>',
      to: email,
      subject: "Good Doctor",
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
const sendMailRegister = async (email: string, verifyCode: number) => {
  const html = `
   <body style="background-color: #E4E5F5; font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #8F7DE1; color: #FFFFFF; text-align: center; padding: 20px;">
      <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Good Doctor</h1>
      <p style="font-size: 14px; margin: 8px 0 0;">Chăm sóc sức khỏe của bạn mọi lúc, mọi nơi</p>
    </div>
    <div style="padding: 20px 30px;">
      <h2 style="font-size: 18px; font-weight: 600; color: #333333; margin: 0;">Xác nhận tài khoản của bạn</h2>
      <p style="font-size: 14px; color: #666666; line-height: 1.6; margin: 10px 0 0;">
        Cảm ơn bạn đã đăng ký tài khoản trên <strong>Good Doctor</strong>. Nhập mã OTP bên dưới để xác nhận tài khoản của bạn.
      </p>
      <div style="margin-top: 20px; text-align: center;">
        <span style="display: inline-block; font-size: 20px; font-weight: bold; color: #FD6F65; letter-spacing: 2px;">
          ${verifyCode}
        </span>
        <p style="font-size: 12px; color: #888888; margin-top: 8px;">Mã OTP này sẽ hết hạn sau 10 phút.</p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <a href='http://${process.env.HOST_FRONTEND}:3000/verify-account?email=${email}' style="display: inline-block; padding: 12px 20px; background-color: #8F7DE1; color: #FFFFFF; text-decoration: none; font-weight: bold; border-radius: 6px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s;">
          Xác nhận ngay
        </a>
      </div>
    </div>
    <div style="background-color: #F7F7F7; text-align: center; padding: 15px; font-size: 12px; color: #666666;">
      <p style="margin: 0;">Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.</p>
      <p style="margin: 8px 0 0;">© 2024 Good Doctor. Tất cả quyền được bảo lưu.</p>
    </div>
  </div>
</body>
`;

  await sendMail(email, html);
};

export { sendMailRegister };
