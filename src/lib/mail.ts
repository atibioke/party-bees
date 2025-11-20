import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_ENCRYPTION === 'ssl', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: MailOptions) => {
  try {
    const fromName = process.env.MAIL_FROM_NAME || 'Skiboh';
    const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME;
    const from = fromAddress ? `"${fromName}" <${fromAddress}>` : fromName;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log('Email sent to:', to, from);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
