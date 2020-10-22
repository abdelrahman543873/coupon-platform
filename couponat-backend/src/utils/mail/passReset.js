import nodemailer from "nodemailer";

async function resetPassMailer(name, code, email) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 25,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Bazar" <${process.env.EMAIL}>`,
    to: email,
    subject: "Bazar Password Resetting",
    html: `<h2>${code}</h2>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return;
    }
  });
}

export { resetPassMailer };
