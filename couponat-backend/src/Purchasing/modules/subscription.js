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
    return await SubscripionModel.findOne({
      user,
      coupon,
      isUsed: false,
    });
  },

  async getSubscriptions(user, provider, isPaid, isConfirmed, isUsed) {
    queryOp = {};
    user ? (queryOp.user = user) : "";
    provider ? (queryOp.provider = provider) : "";
    isPaid ? (queryOp.isPaid = isPaid) : "";
    isConfirmed ? (queryOp.isConfirmed = isConfirmed) : "";
    isUsed ? (queryOp.isUsed = isUsed) : "";

    return await SubscripionModel.find({ ...queryOp });
  },

  async getById(id) {
    return await SubscripionModel.findById(id);
  },

  async scan(code) {
    return await SubscripionModel.findOne({ code });
  },
};

export { subscriptionModule };
