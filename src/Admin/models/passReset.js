import mongoose from "mongoose";

let passwordResetSchecma = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isReseted: {
      type: Boolean,
      default: false,
    },
    isProvider: {
      type: Boolean,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let PassResetModel = mongoose.model("PassReset", passwordResetSchecma);

export { PassResetModel };
