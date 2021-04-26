import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const notification = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
notification.plugin(mongoosePaginate);
export const NotificationModel = mongoose.model("Notification", notification);
