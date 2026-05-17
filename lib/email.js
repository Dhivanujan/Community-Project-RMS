import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (email, username, password, role) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;

        const mailOptions = {
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: 'Welcome to the University System - Your Account Details',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #2563eb; text-align: center;">Welcome to the University System!</h2>
                    <p>Hello,</p>
                    <p>Your <strong>${role}</strong> account has been successfully created by the Super Admin.</p>
                    <p>Here are your temporary login credentials:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Username:</strong> ${username}</p>
                        <p style="margin: 0;"><strong>Temporary Password:</strong> ${password}</p>
                    </div>
                    <p style="color: #d97706; font-weight: bold;">
                        IMPORTANT: You will be required to change this temporary password upon your first login.
                    </p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${loginUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Login to Your Account
                        </a>
                    </div>
                    <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
                        If you did not expect this email, please contact the system administrator immediately.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return false;
    }
};
