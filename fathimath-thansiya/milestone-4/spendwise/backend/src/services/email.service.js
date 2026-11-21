import nodemailer from 'nodemailer';
import env from '../config/env.js';

/**
 * Password reset email delivery.
 *
 * Mail is only sent when SMTP credentials are configured. When they are not,
 * the function reports `sent: false` instead of pretending delivery succeeded,
 * and the caller surfaces that honestly to the user.
 */
const isConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

let transporter = null;
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  if (!isConfigured) {
    return { sent: false, reason: 'Email transport is not configured' };
  }

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject: 'Reset your SpendWise password',
      text: [
        `Hi ${name},`,
        '',
        'Use the link below to reset your SpendWise password.',
        `It expires in ${env.resetTokenTtlMinutes} minutes.`,
        '',
        resetUrl,
        '',
        'If you did not request this, you can ignore this email.',
      ].join('\n'),
      html: `
        <p>Hi ${name},</p>
        <p>Use the link below to reset your SpendWise password. It expires in ${env.resetTokenTtlMinutes} minutes.</p>
        <p><a href="${resetUrl}">Reset my password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
    return { sent: true };
  } catch (error) {
    console.error('[spendwise] Password reset email failed:', error.message);
    return { sent: false, reason: 'Email could not be delivered' };
  }
}

export default { sendPasswordResetEmail, isConfigured };
