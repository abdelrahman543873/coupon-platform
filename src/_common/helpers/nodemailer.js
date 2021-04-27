import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
async function sendClientMail(subject, message, email) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 25,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Couponat" <${process.env.EMAIL}>`,
    to: email,
    subject: subject,
    html: `<h2>${message}</h2>`,
  };
  if (process.env.NODE_ENV !== "production") return "success";
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return;
    }
  });
}

export { sendClientMail };
