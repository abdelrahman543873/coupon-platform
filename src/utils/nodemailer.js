import nodemailer from "nodemailer";

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
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return;
    }
  });
}

export { sendClientMail };
