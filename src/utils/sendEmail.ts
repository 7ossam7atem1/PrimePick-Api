import nodemailer from 'nodemailer';
import ejs from 'ejs';
import juice from 'juice';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { htmlToText } from 'html-to-text';

dotenv.config();

interface EmailOptions {
  email: string;
  name: string;
  url: string;
}

class SendEmail {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: { email: string; name: string }, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Hossam Hatem <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      // Mailtrap
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT), // Ensure port is a number
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
    }
  }

  async send(template: string, subject: string) {
    try {
      // Render HTML for email based on the EJS template
      const templatePath = path.resolve(
        __dirname,
        `../utils/views/email/${template}.ejs`
      );
      const cssPath = path.resolve(
        __dirname,
        `../utils/views/styles/${template}.css`
      );

      // Render the EJS template with the provided data
      const html = await ejs.renderFile(templatePath, {
        firstName: this.firstName,
        url: this.url,
      });

      // Read the CSS file
      const css = fs.readFileSync(cssPath, 'utf-8');

      // Inline the CSS into the HTML
      const inlinedHtml = juice.inlineContent(html, css);

      const mailOpts = {
        from: this.from,
        to: this.to,
        subject,
        html: inlinedHtml,
        text: htmlToText(inlinedHtml), // Convert HTML to plain text
      };

      await this.newTransport().sendMail(mailOpts);
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to PrimePick!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your Password Reset token (valid only for 10 minutes)'
    );
  }
}

export default SendEmail;
