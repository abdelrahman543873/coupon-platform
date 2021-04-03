import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
export const sendMessage = async ({ to, text }) => {
  return process.env.NODE_ENV === "production"
    ? await client.messages.create({
        body: text,
        from: process.env.TWILIO_NUMBER,
        to: to,
      })
    : "success";
};
