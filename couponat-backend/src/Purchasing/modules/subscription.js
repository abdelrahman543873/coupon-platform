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
      note: "",
    });
  },

  async getSubscriptions(user, provider, isPaid, isConfirmed, isUsed, note) {
    if (!checkAllMongooseId(user)) return null;

    if (!checkAllMongooseId(provider)) return null;

    let queryOp = {};
    user ? (queryOp.user = user) : "";
    provider ? (queryOp.provider = provider) : "";
    isConfirmed == false || isConfirmed == true
      ? (queryOp.isConfirmed = isConfirmed)
      : "";
    note ? (queryOp.note = "") : "";
    // isUsed ? (queryOp.isUsed = isUsed) : "";
    // isPaid ? (queryOp.isPaid = isPaid) : "";

    return await SubscripionModel.find({ ...queryOp }).sort("-createdAt");
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;

    return await SubscripionModel.findById(id);
  },

  async scan(id, code) {
    if (!checkAllMongooseId(id)) return null;
    return await SubscripionModel.findOne({
      code,
      isConfirmed: true,
      provider: id,
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
