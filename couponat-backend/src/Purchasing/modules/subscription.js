import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
import { SubscripionModel } from "../models/subscription";

let subscriptionModule = {
  async subscripe(subscripe) {
    console.log(subscripe);
    return await SubscripionModel({ ...subscripe })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          doc: null,
          err,
        };
      });
  },

  async getUserSubscripe(user, coupon) {
    if (!checkAllMongooseId(user)) return null;

    if (!checkAllMongooseId(coupon)) return null;

    return await SubscripionModel.findOne({
      user,
      coupon,
      isUsed: false,
    });
  },

  async getSubscriptions(user, provider, isPaid, isConfirmed, isUsed) {
    if (!checkAllMongooseId(user)) return null;

    if (!checkAllMongooseId(provider)) return null;

    let queryOp = {};
    user ? (queryOp.user = user) : "";
    provider ? (queryOp.provider = provider) : "";
    // isPaid ? (queryOp.isPaid = isPaid) : "";
    // isConfirmed ? (queryOp.isConfirmed = isConfirmed) : "";
    // isUsed ? (queryOp.isUsed = isUsed) : "";

    return await SubscripionModel.find({ ...queryOp });
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;

    return await SubscripionModel.findById(id);
  },

  async scan(code) {
    return await SubscripionModel.findOne({ code });
  },
};

export { subscriptionModule };
