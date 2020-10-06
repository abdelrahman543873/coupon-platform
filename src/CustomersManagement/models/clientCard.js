import mongoose from "mongoose";
import { boolean } from "@hapi/joi";

let creditSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    cardNumber: {
      type: String,
      default: true,
      unique: true,
    },
    cvvCode: {
      type: String,
      default: true,
      required: true,
    },
    expirationMonth: {
      type: String,
      default: true,
      required: true,
    },
    expirationYear: {
      type: String,
      default: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

let ClientCardModel = mongoose.model("ClientCard", creditSchema);

export { ClientCardModel };
