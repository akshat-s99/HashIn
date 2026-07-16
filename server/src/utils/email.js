import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const sendEmail = async (options) => {
  let transporter;

  // If SMTP config is missing, fall back to Ethereal Email for testing
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    console.log('No SMTP credentials found in .env. Falling back to Ethereal Email for testing.');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  const message = {
    from: `${env.FROM_NAME || 'HashIn'} <${env.FROM_EMAIL || 'noreply@hashin.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML version
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};
