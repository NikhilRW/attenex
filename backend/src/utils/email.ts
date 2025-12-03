import nodemailer from "nodemailer";
import "dotenv/config";

export const getTransporter = () => {
  // Setup email transporter
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });
};
