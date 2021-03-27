import mongoose from "mongoose";

let appCreditSchema = mongoose.Schema(
  {
    merchantEmail: {
      type: String,
      required: true,
      unique: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

let AppCreditModel = mongoose.model("AppCredit", appCreditSchema);

// let cridit=async ()=>{
//   let cridits= await AppCreditModel.findOne();
//   if(!cridits)
//    await AppCreditModel({
//      merchantEmail: "alef.software.saudi@gmail.com",
//      secretKey:
//        "br9i6nmVR05jezlYGW72MXkH8NctHt2TUbc1zyWqz1JNA5Lh2SjOQEwYrIr9bu26Fe7eN3Fm5paFvWXxPgmFVSEmB6wNAzTgO0vB",
//    }).save().catch(err=>{});
// };
// cridit();
export { AppCreditModel };
