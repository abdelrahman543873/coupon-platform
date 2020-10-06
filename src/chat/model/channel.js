import mongoose from "mongoose";

let channelSchema = mongoose.Schema({
  usrsStr: {
    type: String,
    required: true,
    unique: true,
  },
  lastMessage: {
    type: String,
    default: "",
  },
  lastType:{
    type: String,
    default: "",
  }
});
let ChannelModel = mongoose.model("Channel", channelSchema);

export { ChannelModel };
