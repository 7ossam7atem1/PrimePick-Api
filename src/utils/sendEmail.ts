import nodemailer from 'nodemailer';
import { EmailOptions } from './../types/auth.interface';
import ejs from 'ejs';
import juice from 'juice';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { htmlToText } from 'html-to-text';
dotenv.config();

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const templatePath = path.resolve(
    __dirname,
    `../views/email/${options.template}.ejs`
  );
  const cssPath = path.resolve(
    __dirname,
    `../views/email/styles/${options.template}.css`
  );

  // Render HTML for email based on the EJS template
  const html = await ejs.renderFile(templatePath, {
    firstName: options.firstName,
    url: options.url,
  });

  // Read the CSS file
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Inline the CSS into the HTML
  const inlinedHtml = juice.inlineContent(html, css);

  const mailOpts = {
    from: 'PrimePick App <7ossam7atem1@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: inlinedHtml,
    text: htmlToText(inlinedHtml), // Convert HTML to plain text
  };

  await transporter.sendMail(mailOpts);
};
