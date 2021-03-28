import mongoose from "mongoose";
let tokensSchema = mongoose.Schema({
  fcmToken: String
}, {
  versionKey: false
});
let TokensModel = mongoose.model("Tokens", tokensSchema);
export { TokensModel };