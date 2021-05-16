import mongoose from "mongoose";
import { TermsAndConditionsEnum } from "../terms-and-conditions.enum.js";
const termsAndConditions = mongoose.Schema(
  {
    enDescription: {
      type: String,
      required: true,
    },
    arDescription: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      unique: true,
      required: true,
      enum: TermsAndConditionsEnum,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const termsAndConditionsModel = mongoose.model(
  "TermsAndCondition",
  termsAndConditions
);

export { termsAndConditionsModel };
