import mongoose from "mongoose";

let notificationSchema = mongoose.Schema(
  {
    user: {
      type:String,
      required: true,
    },
    titleEn: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    bodyAr: {
      type: String,
      required: true,
    },
    bodyEn: {
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

let NotificationModel = mongoose.model("Notification", notificationSchema);

export { NotificationModel };
