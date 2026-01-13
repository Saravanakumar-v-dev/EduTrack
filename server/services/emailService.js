import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ======================================================
   TRANSPORTER SETUP WITH AUTO-ETHEREAL
====================================================== */
let transporter;
let etherealCredentials = null;

// Initialize transporter (async)
async function initializeTransporter() {
  // If email credentials are provided in .env, use them
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(`ℹ️  Using email config: ${process.env.EMAIL_HOST}`);
  } else {
    // Auto-create Ethereal test account for development
    console.log("📧 No email credentials found - creating Ethereal test account...");

    const testAccount = await nodemailer.createTestAccount();
    etherealCredentials = testAccount;

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("\n" + "=".repeat(70));
    console.log("✅ ETHEREAL TEST ACCOUNT AUTO-CREATED!");
    console.log("=".repeat(70));
    console.log(`📧 Email: ${testAccount.user}`);
    console.log(`🔑 Password: ${testAccount.pass}`);
    console.log(`🌐 View emails at: https://ethereal.email/messages`);
    console.log("=".repeat(70) + "\n");
  }
}

/* ======================================================
   VERIFY TRANSPORTER (ON STARTUP)
====================================================== */
export const verifyEmailTransporter = async () => {
  try {
    await initializeTransporter();
    await transporter.verify();
    console.log("✅ Email service ready");
  } catch (err) {
    console.error("❌ Email service failed:", err.message);
  }
};

/* ======================================================
   SEND OTP EMAIL
====================================================== */
export const sendOtpEmail = async (
  toEmail,
  otp,
  purpose = "Verification"
) => {
  if (!transporter) {
    await initializeTransporter();
  }

  if (!toEmail || !otp) {
    throw new Error("Email and OTP are required");
  }

  const senderEmail = etherealCredentials
    ? etherealCredentials.user
    : process.env.EMAIL_USER;

  const mailOptions = {
    from: `EduTrack Support <${senderEmail}>`,
    to: toEmail,
    subject: `EduTrack | ${purpose} Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
        <h2 style="color:#4f46e5;">${purpose}</h2>
        <p>Your 6-digit code:</p>
        <h1 style="letter-spacing:6px;">${otp}</h1>
        <p>Expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 OTP email sent → ${toEmail}`);

    if (etherealCredentials || process.env.EMAIL_HOST === "smtp.ethereal.email") {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) {
        console.log("🔗 OTP Preview:", preview);
      }
    }

    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};
