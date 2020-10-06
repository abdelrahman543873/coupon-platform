import { ChatlModel } from "../model/chat";
import { ChannelModule } from "./channel";

const ChatModule = {
  async saveMessges(messages) {
    console.log(messages)
    let message =await messages[messages.length - 1];
    await ChannelModule.setLastMessage(message.channelId, message);
    return await ChatlModel.insertMany(messages).catch((err) => {
      console.log(err)
      return err;
    });
  },

  async getMessages(channelId, skip = 0, limit = 0) {
    return await ChatlModel.find({ channelId: channelId })
      .skip(skip)
      .limit(limit)
      .sort("-date")
      .catch((err) => {
        console.log(err);
        return [];
      });
  },
};

export { ChatModule };
