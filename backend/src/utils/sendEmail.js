import nodemailer from "nodemailer";
import logger from "../logger.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    // Read env vars lazily to ensure dotenv has loaded them
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const SMTP_FROM = process.env.SMTP_FROM;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      logger.warn(
        {
          hasHost: !!SMTP_HOST,
          hasPort: !!SMTP_PORT,
          hasUser: !!SMTP_USER,
          hasPass: !!SMTP_PASS,
          hasFrom: !!SMTP_FROM,
        },
        "SMTP configuration is incomplete. Emails will not be sent.",
      );
      return null;
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Log successful SMTP configuration (without exposing password)
    logger.info(
      {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        from: SMTP_FROM,
      },
      "SMTP transporter configured successfully",
    );
  }
  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  const tx = getTransporter();
  if (!tx) {
    logger.warn({ to, subject }, "Skipping email send due to missing SMTP");
    return false;
  }

  try {
    const info = await tx.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    logger.info({ to, subject, messageId: info.messageId }, "Email sent successfully");
    return true;
  } catch (err) {
    logger.error(
      {
        err: {
          message: err.message,
          code: err.code,
          responseCode: err.responseCode,
          response: err.response,
        },
        to,
        subject,
      },
      "Failed to send email",
    );
    // Don't throw - let the caller handle gracefully
    return false;
  }
}
