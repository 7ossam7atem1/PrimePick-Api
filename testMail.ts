import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testMail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Mail',
      text: 'This is a test email.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending test email:', err);
  }
};

testMail();
