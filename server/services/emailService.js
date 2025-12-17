import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a 6-digit OTP code via email.
 * @param {string} toEmail - Recipient's email.
 * @param {string} otp - The 6-digit OTP code.
 * @param {string} purpose - The reason for the OTP (e.g., 'Account Verification', 'Password Reset').
 */
export const sendOtpEmail = async (toEmail, otp, purpose = 'Verification') => {
    const mailOptions = {
        from: `EduTrack Support <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `EduTrack - Your ${purpose} Code`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>${purpose} Code</h2>
                <p>Please use the following 6-digit code to complete your action:</p>
                <p style="font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 2px;">
                    ${otp}
                </p>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <p>Thank you,</p>
                <p>The EduTrack Team</p>
            </div>
        `,
        text: `Your EduTrack ${purpose} Code is: ${otp}\nThis code expires in 10 minutes. If you did not request this, please ignore this email.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${toEmail} for ${purpose}. Message ID: ${info.messageId}`);
        // Log Ethereal preview URL if using Ethereal
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email' && nodemailer.getTestMessageUrl) {
            console.log(`Ethereal Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return info;
    } catch (error) {
        console.error(`Error sending OTP email to ${toEmail}:`, error);
        throw new Error(`Failed to send ${purpose} email.`);
    }
};

// Keep the sendPasswordResetEmail function if you still need token-based reset elsewhere,
// otherwise, you can remove it if OTP is the only method now.
export const sendPasswordResetEmail = async (toEmail, resetToken) => {
    // ... (existing token-based reset email logic) ...
};