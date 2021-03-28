import mongoose from "mongoose";

function checkMongooseId(value, helper) {
  try {
    let check = value == new mongoose.Types.ObjectId(value) ? true : false;

    if (!check) {
      return helper.error("any.invalid");
    }

    return value;
  } catch (err) {
    return helper.error("any.invalid");
  }
}

function checkAllMongooseId(value) {
  try {
    value == new mongoose.Types.ObjectId(value);
    return true;
  } catch (err) {
    return false;
  }
}

export { checkMongooseId, checkAllMongooseId };