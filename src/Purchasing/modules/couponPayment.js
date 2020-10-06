import { CouponPayModel } from "../models/couponPayment";

let CouponPayModule = {
  async add(coupon) {
    return await CouponPayModel({ ...coupon })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err,
        };
      });
  },
  async getById(id) {
    return await CouponPayModel.findById(id);
  },

  async getConsumedCoupons(
    clientId,
    bazar,
    expired,
    confirmed,
    clientPop,
    bazarPop
  ) {
    let qyeryOp = {};
    let bazarPath = "",
      clientPath = "";
    if (clientId) qyeryOp.clientId = clientId;
    if (bazar) qyeryOp.bazar = bazar;
    if ((expired && expired == "true") || expired == true) {
      qyeryOp.expirationDate = { $lt: new Date() };
    } else qyeryOp.expirationDate = { $gte: new Date() };

    if (confirmed && (confirmed == "true" || confirmed == true))
      qyeryOp.isConfirmed = true;
    if (confirmed && (confirmed == "false" || confirmed == false))
      qyeryOp.isConfirmed = false;
    if (clientPop == "true" || clientPop == true) clientPath = "clientId";
    if (bazarPop == "true" || bazarPop == true) bazarPath = "bazar";
    console.log(qyeryOp);
    return await CouponPayModel.find({
      ...qyeryOp,
    })
      .populate("couponId")
      .populate("paymentId")
      .populate({ path: clientPath })
      .populate({ path: bazarPath })
      .sort("-createdAt")
      .populate("accountId");
  },
};
export { CouponPayModule };
