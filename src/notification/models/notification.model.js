import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { NotifiedEnum } from "../notification.enum.js";
const notification = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      enum: NotifiedEnum,
    },
    arTitle: {
      type: String,
      required: true,
    },
    enTitle: {
      type: String,
      required: true,
    },
    enBody: {
      type: String,
      required: true,
    },
    arBody: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
notification.plugin(mongoosePaginate);
export const NotificationModel = mongoose.model("Notification", notification);
