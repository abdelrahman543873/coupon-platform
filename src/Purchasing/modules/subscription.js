import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
import { SubscripionModel } from "../models/subscription.js";

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
      note: "",
    });
  },

  async getSubscriptions(
    user,
    provider,
    isPaid,
    isConfirmed,
    note,
    skip = null,
    limit = null
  ) {
    if (!checkAllMongooseId(user)) return null;

    if (!checkAllMongooseId(provider)) return null;

    let queryOp = {};
    user ? (queryOp.user = user) : "";
    provider ? (queryOp.provider = provider) : "";
    isPaid ? (queryOp.isPaid = true) : "";
    isConfirmed == false || isConfirmed == true
      ? (queryOp.isConfirmed = isConfirmed)
      : "";
    note ? (queryOp.note = "") : "";
    // isUsed ? (queryOp.isUsed = isUsed) : "";
    // isPaid ? (queryOp.isPaid = isPaid) : "";

    return await SubscripionModel.find({ ...queryOp })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;

    return await SubscripionModel.findById(id);
  },

  async scan(user, provider) {
    if (!checkAllMongooseId(user)) return [];
    if (!checkAllMongooseId(provider)) return [];

    return await SubscripionModel.find({
      user,
      provider,
      isUsed: false,
    });
  },

  async delete(ids) {
    //if (!checkAllMongooseId(ids)) return null;
    return await SubscripionModel.deleteMany({ _id: { $in: ids } })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { subscriptionModule };
