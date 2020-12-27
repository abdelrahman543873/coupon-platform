const accountSid = "AC5e2668916e49d5fde74adb6b81c682c8";
const authToken = "509044841ed0f6d4382905df4b1b098e";
const client = require("twilio")(accountSid, authToken);
const from = "+18444628115";

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
