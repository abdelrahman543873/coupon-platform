import twilio from "twilio";

const accountSid = "AC5e2668916e49d5fde74adb6b81c682c8";
const authToken = "509044841ed0f6d4382905df4b1b098e";
const from = "+18444628115";
const client = twilio(accountSid, authToken);
let Messages = {
  async sendMessage(to, text) {
    return await client.messages
      .create({
        body: text,
        from: from,
        to: to,
      })
      .then(() => {
        return "Success";
      })
      .catch((err) => {
        return err;
      });
  },
};

export { Messages };