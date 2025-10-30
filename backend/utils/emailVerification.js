import validator from "validator";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("🔑 SENDGRID_API_KEY present:", !!process.env.SENDGRID_API_KEY);
console.log("📤 FROM EMAIL:", process.env.SENDGRID_FROM_EMAIL);

// Validate email format, disposable emails, and fake patterns
export const validateEmail = async (email) => {
  try {
    if (!validator.isEmail(email)) {
      return { isValid: false, reason: "Invalid email format" };
    }

    const disposableDomains = [
      "tempmail.com",
      "guerrillamail.com",
      "mailinator.com",
      "10minutemail.com",
      "throwawaymail.com",
      "fakeinbox.com",
      "yopmail.com",
      "temp-mail.org",
      "trashmail.com",
    ];

    const domain = email.split("@")[1].toLowerCase();
    if (disposableDomains.some((d) => domain.includes(d))) {
      return {
        isValid: false,
        reason: "Disposable email addresses are not allowed",
      };
    }

    const fakePatterns = [
      /^test\d*@/i,
      /^demo\d*@/i,
      /^fake\d*@/i,
      /^temp\d*@/i,
      /^admin\d*@/i,
    ];
    if (fakePatterns.some((p) => p.test(email))) {
      return { isValid: false, reason: "Suspicious email pattern detected" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, reason: "Email verification failed" };
  }
};

// Send verification email using SendGrid - YOUR EXISTING LOGIC
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Verify Your ChronoSync Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Please verify Your Email to start using ChronoSync</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    return false;
  }
};

// NEW: Send admin notification when user registers
export const sendNewUserNotification = async (user) => {
  try {
    const msg = {
      to: process.env.ADMIN_EMAIL || process.env.SENDGRID_FROM_EMAIL, // Send to admin or fallback to from email
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "🎉 New User Registered on ChronoSync!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">New User Alert!</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>User ID:</strong> ${user._id}</p>
            <p><strong>Email Verified:</strong> ${
              user.isEmailVerified ? "Yes" : "No"
            }</p>
          </div>
          <p style="margin-top: 20px; color: #6b7280;">
            This is an automated notification from your ChronoSync app.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`📧 Admin notification sent for new user: ${user.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending admin notification:", error);
    return false;
  }
};

// NEW: Send welcome email to user (optional)
export const sendWelcomeEmail = async (user) => {
  try {
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Welcome to ChronoSync! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Welcome to ChronoSync, ${user.name}! 🎉</h2>
          <p>We're excited to have you on board. Here's what you can do with ChronoSync:</p>
          <ul>
            <li>📊 Track your time across different activities</li>
            <li>📈 View beautiful analytics and insights</li>
            <li>🏷️ Create custom categories</li>
            <li>📱 Access from any device</li>
          </ul>
          <p>Ready to get started? <a href="${process.env.FRONTEND_URL}">Login to your account</a></p>
          <p>If you have any questions, just reply to this email!</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return false;
  }
};
