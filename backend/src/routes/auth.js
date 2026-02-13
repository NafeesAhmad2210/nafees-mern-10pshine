import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../logger.js";
import { sendEmail } from "../utils/sendEmail.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    logger.error({ err }, "Get me error");
    res.status(500).json({ error: "Failed to get user" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      logger.warn(
        { body: req.body },
        "Signup validation failed: missing fields",
      );
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      logger.warn({ email }, "Signup failed: email already registered");
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    logger.info({ userId: user._id, email: user.email }, "User registered");

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error({ err }, "Signup error");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn(
        { body: req.body },
        "Login validation failed: missing fields",
      );
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn({ email }, "Login failed: user not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      logger.warn({ email }, "Login failed: wrong password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    logger.info({ userId: user._id, email: user.email }, "User logged in");

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn({ email }, "Forgot password: user not found");
      return res.json({
        message:
          "If an account with that email exists, an OTP has been sent to it.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpiresAt = expires;
    await user.save();

    logger.info({ email, otp }, "Generated password reset OTP");

    // Try to send email, but don't fail the request if it doesn't work
    try {
      const emailSent = await sendEmail({
        to: email,
        subject: "Your password reset OTP",
        text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your password reset OTP is: <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`,
      });
      if (!emailSent) {
        logger.warn(
          { email },
          "Email sending returned false - check SMTP configuration",
        );
      }
    } catch (emailErr) {
      logger.error(
        { email, err: emailErr },
        "Exception while sending OTP email, but OTP was generated",
      );
      // Continue anyway - OTP is still saved in database
    }

    return res.json({
      message:
        "If an account with that email exists, an OTP has been sent to it.",
    });
  } catch (err) {
    logger.error({ err }, "Forgot password error");
    return res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetOtp ||
      user.resetOtp !== otp ||
      !user.resetOtpExpiresAt ||
      user.resetOtpExpiresAt.getTime() < Date.now()
    ) {
      logger.warn({ email }, "OTP verification failed");
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP and generate a short-lived reset token
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    const resetToken = jwt.sign(
      { userId: user._id, purpose: "passwordReset" },
      JWT_SECRET,
      { expiresIn: "10m" },
    );

    return res.json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (err) {
    logger.error({ err }, "Verify OTP error");
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (payload.purpose !== "passwordReset" || !payload.userId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = password;
    // resetOtp fields are already cleared when OTP was verified, but clear again just in case
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    logger.info(
      { userId: user._id, email: user.email },
      "Password reset via OTP",
    );

    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    logger.error({ err }, "Reset password error");
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
