import boom from "@hapi/boom";
import { CouponModule } from "../../Products/modules/coupon";
import { BazarModule } from "../../ProviderManagement/modules/bazar";
import { ClientModule } from "../../CustomersManagement/modules/client";
import { CouponPayModule } from "../modules/couponPayment";
import { BankModel } from "../../ProviderManagement/models/bankAccount";
import { CreditModel } from "../../ProviderManagement/models/criditCard";
let CouponPayController = {
  async add(req, res, next) {
    let couponPayment = req.body;
    let clientId = req.params.id;
    let couponId = req.params.couponId;

    let coupon = await CouponModule.getById(couponId);
    if (!coupon) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "coupon not found!" : "كوبون الخصم غير موجود";
      return next(boom.badData(errMsg));
    }

    let bazar = await BazarModule.getById(couponPayment.bazar);
    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "bazar not found!" : "المتجر غير موجود";
      return next(boom.badData(errMsg));
    }

    let client = await ClientModule.getById(clientId);
    if (!client) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "client not found!" : "المستخدم غير موجود";
      return next(boom.badData(errMsg));
    }
    if (couponPayment.accountId) {
      let account =
        (await BankModel.findById(couponPayment.accountId)) ||
        (await CreditModel.findById(couponPayment.accountId));
      if (!account) {
        let lang = req.headers.lang || "ar",
          errMsg = lang == "en" ? "account not found!" : "الحساب غير موجود";
        return next(boom.badData(errMsg));
      }
    }
    if (
      couponPayment.paymentType &&
      couponPayment.paymentType == "BANK_TRANSFER"
    ) {
      couponPayment.isConfirmed = false;
    }
    couponPayment.clientId = clientId;
    couponPayment.couponId = couponId;
    if (req.file) {
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/purchasing-management/orders/payments/payments-images/" +
        req.file.filename;
      couponPayment.imgURL = imgURL;
    }
    let { doc, err } = await CouponPayModule.add(couponPayment);

    if (err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    }

    return res.status(200).send({
      isSuccessed: true,
      data: doc,
      error: null,
    });
  },

  async getConsumedCoupons(req, res, next) {
    let clientId = req.params.id;
    let confirmed = req.query.confirmed || null;
    let expired = req.query.expired || false;

    let client = await ClientModule.getById(clientId);
    if (!client) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "client not found!" : "المستخدم غير موجود";
      return next(boom.badData(errMsg));
    }

    let coupons = await CouponPayModule.getConsumedCoupons(
      clientId,
      null,
      expired,
      confirmed,
      false,
      true
    );

    for (let i = 0; i < coupons.length; i++) {
      // coupons[i] = await coupons[i].populate("bazar").execPopulate();

      coupons[i] = await coupons[i]
        .populate("bazar.bankAccount")
        .populate("bazar.creditCard")
        .populate("bazar.provider")
        .execPopulate();
    }
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },
};

export { CouponPayController };
