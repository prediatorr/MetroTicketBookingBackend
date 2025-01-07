// utils/otpUtils.js
const nodemailer = require("nodemailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
  try {
    // Create Transporter with debug logging
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true, // Enable debugging
      logger: true  // Log to console
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("Transporter verified successfully");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}. This OTP will expire in 10 minutes.`
    };

    console.log("Attempting to send email to:", email);
    console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
    // Don't log EMAIL_PASS for security

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true;

  } catch (error) {
    console.error("Detailed email error:", error);
    console.error("Error stack:", error.stack);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports = { generateOTP, sendOTP };