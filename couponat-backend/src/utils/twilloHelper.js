// const accountSid = "AC5e2668916e49d5fde74adb6b81c682c8";
// const authToken = "509044841ed0f6d4382905df4b1b098e";
// const client = require("twilio")(accountSid, authToken);
// const from = "+18444628115";

const accountSid = "ACdffc39161303e8612134e9154f6a5473";
const authToken = "0a1ff2ba56bc11a0afebeadb588c9616";
const client = require("twilio")(accountSid, authToken);
const from = "+12027299154";


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
