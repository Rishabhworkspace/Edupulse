const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const getTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.sendgrid.net';
  const isSendGrid = host.includes('sendgrid');
  
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: isSendGrid ? 'apikey' : process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 30000,
  });
};

const send = async (to, subject, html) => {
  if (!process.env.EMAIL_PASS) {
    logger.error(`[Email - SKIPPED] No EMAIL_PASS provided.`);
    throw new Error('Email service is not configured (missing password)');
  }

  const transporter = getTransporter();
  const FROM = `"${process.env.EMAIL_FROM_NAME || 'EduPulse'}" <${process.env.EMAIL_FROM || 'noreply@edupulse.com'}>`;

  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html });
    logger.info(`[Email - SENT] To: ${to} | MessageID: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`[Email - FAILED] To: ${to} | Error: ${error.message}`);
    // Always throw the error so the controller can handle it (e.g. rollback DB)
    throw new Error(`SMTP Error: ${error.message}`);
  }
};

const sendVerificationEmail = (to, name, otp) => {
  // ALWAYS log OTP so admin can manually verify users if SMTP is completely broken
  logger.info(`[CRITICAL - OTP GENERATED] Email: ${to} | OTP: ${otp}`);
  
  return send(to, 'Verify your EduPulse email', `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#5C5FEF">Welcome to EduPulse, ${name}! 🎓</h2>
    <p>Please verify your email address to start learning.</p>
    <div style="background:#F3F4F6;padding:24px;border-radius:12px;text-align:center;margin:24px 0">
      <p style="margin:0 0 8px;color:#6B7280;font-size:14px">Your verification code:</p>
      <p style="margin:0;font-size:48px;font-weight:800;letter-spacing:8px;color:#5C5FEF">${otp}</p>
    </div>
    <p style="color:#6B7280;font-size:14px">This code expires in 10 minutes.</p>
  </div>`
  );
};

const sendPasswordResetEmail = (to, name, token) => send(to, 'Reset your EduPulse password', `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#5C5FEF">Password Reset Request</h2>
    <p>Hi ${name}, click below to reset your password.</p>
    <a href="${process.env.CLIENT_URL}/reset-password/${token}" style="display:inline-block;padding:12px 24px;background:#5C5FEF;color:white;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
    <p style="color:#6B7280;font-size:14px;margin-top:24px">Expires in 1 hour. If you didn't request this, ignore this email.</p>
  </div>`
);

const sendEnrollmentConfirmation = (to, name, courseTitle) => send(to, `You're enrolled in ${courseTitle}! 🎉`, `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#5C5FEF">Enrollment Confirmed!</h2>
    <p>Hi ${name}, you're now enrolled in <strong>${courseTitle}</strong>.</p>
    <a href="${process.env.CLIENT_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#5C5FEF;color:white;border-radius:8px;text-decoration:none;font-weight:600">Start Learning →</a>
  </div>`
);

const sendCertificateEmail = (to, name, courseTitle, certUrl) => send(to, `Your certificate for ${courseTitle} is ready! 🏆`, `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#5C5FEF">Congratulations, ${name}! 🏆</h2>
    <p>You've completed <strong>${courseTitle}</strong>. Your certificate is ready.</p>
    <a href="${certUrl}" style="display:inline-block;padding:12px 24px;background:#F59E0B;color:white;border-radius:8px;text-decoration:none;font-weight:600">Download Certificate</a>
  </div>`
);

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendEnrollmentConfirmation, sendCertificateEmail };
