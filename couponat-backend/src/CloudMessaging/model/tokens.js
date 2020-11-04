import mongoose from "mongoose";

let tokensSchema = mongoose.Schema({
  fcmToken: String,
});

let TokensModel = mongoose.model("Tokens", tokensSchema);

export { TokensModel };
