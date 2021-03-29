import mongoose from "mongoose";

const termsAndConditions = mongoose.Schema({
  enDescription: {
    type: String,
    required: true,
  },
  arDescription: {
    type: String,
    required: true,
  },
});

const termsAndConditionsModel = mongoose.model(
  "TermsAndCondition",
  termsAndConditions
);

export { termsAndConditionsModel };
