import mongoose from "mongoose";

let creditSchema = mongoose.Schema(
  {
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    merchantEmail: {
      type: String,
      required: true,
      unique: true,
    },
    secretKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

let CreditModel = mongoose.model("Credit", creditSchema);

export { CreditModel };
