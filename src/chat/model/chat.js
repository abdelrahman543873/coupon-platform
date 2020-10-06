import mongoose from "mongoose";

let chatSchema = mongoose.Schema({
  _id: false,
  id: {
    type: String,
    required: true,
    unique: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channels",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  from: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

let ChatlModel = mongoose.model("Chat", chatSchema);

export { ChatlModel };