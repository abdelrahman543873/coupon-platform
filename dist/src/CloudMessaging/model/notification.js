import mongoose from "mongoose";
let notificationSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  title: {
    arabic: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  },
  body: {
    arabic: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  },
  data: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});
let NotificationModel = mongoose.model("Notification", notificationSchema);
export { NotificationModel };