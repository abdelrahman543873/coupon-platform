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
      enum: TermsAndConditionsEnum,
    },
  },
  {
    versionKey: false,
  }
);

const termsAndConditionsModel = mongoose.model(
  "TermsAndCondition",
  termsAndConditions
);

export { termsAndConditionsModel };
