import mongoose from "mongoose";
let appBankSchema = mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  bankName: {
    type: String,
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  swiftCode: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false
});
let AppBankModel = mongoose.model("AppBanks", appBankSchema);
export { AppBankModel };