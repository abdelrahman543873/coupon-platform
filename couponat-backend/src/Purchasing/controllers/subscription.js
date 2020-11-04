import boom from "@hapi/boom";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { CouponModule } from "../../Coupons/modules/coupon";
import { Subscription } from "../../middlewares/responsHandler";
import { ClientModule } from "../../Users/modules/client";
import { ProviderModule } from "../../Users/modules/provider";
import { decodeToken } from "../../utils/JWTHelper";
import { paymentTypeModule } from "../modules/paymentType";
import { subscriptionModule } from "../modules/subscription";
import { AppBankModel } from "../../Purchasing/models/appBanks";
import { AppCreditModel } from "../../Purchasing/models/appCridit";
import { getErrorMessage } from "../../utils/handleDBError";

let subscriptionContoller = {
  async subscripe(req, res, next) {
    let subscription = req.body;
    let auth = await decodeToken(req.headers.authentication);
    let coupon = await CouponModule.getById(subscription.coupon);
    console.log("as: ", coupon);
    if (coupon.err || !coupon.doc || coupon.doc.totalCount <= 0) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Coupon not Found" : "كوبون الخصم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let user = await ClientModule.getById(auth.id);
    if (!user) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "User not Found" : " المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let provider = await ProviderModule.getById(subscription.provider);
    if (!provider) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Provider not Found" : " مزود الخدمة غير موجود";
      return next(boom.notFound(errMsg));
    }
    let paymentType = await paymentTypeModule.getById(subscription.paymentType);
    if (!paymentType) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "Payment Type not Found" : "طريقة الدفع غير موجودة";
      return next(boom.notFound(errMsg));
    }
    if (
      paymentType.key == "ONLINE_PAYMENT" ||
      paymentType.key == "BANK_TRANSFER"
    ) {
      if (!req.body.account) {
        return next(boom.badData("Must add acount"));
      }
      let account = "";
      if (!req.body.transactionId) {
        let lang = req.headers.lang || "ar",
          errMsg =
            lang == "en"
              ? "Transaction Id must added"
              : "يجب ادخال كود عملية الدفع";
        return next(boom.notFound(errMsg));
      }
      if (paymentType.key == "ONLINE_PAYMENT")
        account = await AppCreditModel.findById(req.body.account);
      else account = await AppBankModel.findById(req.body.account);

      if (!account) {
        let lang = req.headers.lang || "ar",
          errMsg =
            lang == "en" ? "account not found" : "حساب التحويل غير موجود";
        return next(boom.notFound(errMsg));
      }
    }
    subscription.user = auth.id;
    if (paymentType.key == "BANK_TRANSFER" && !req.file) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Transaction Image must added"
            : "يجب ارفاق اثبات عملية الدفع";
      return next(boom.notFound(errMsg));
    }

    paymentType.key == "BANK_TRANSFER"
      ? (subscription.isConfirmed = false)
      : paymentType.key == "ONLINE_PAYMENT"
      ? (subscription.isPaid = true)
      : "";

    subscription.code = nanoid(6);
    let fileName = subscription.code + Date.now() + ".png";
    let qrURL = QRCode.toFile(
      "./Subscriptions-Images/" + fileName,
      subscription.code
    );
    subscription.qrURL =
      "/purchasing-management/subscriptions-images/" + fileName;

    if (req.file) {
      let imgURL =
        "/purchasing-management/subscriptions-images/" + req.file.filename;
      subscription.imgURL = imgURL;
    }
    let subscripe = await subscriptionModule.subscripe(subscription);
    if (subscripe.err) {
      console.log("error: ", subscripe.err);
      return next(
        boom.badData(getErrorMessage(subscripe.err, req.headers.lang || "ar"))
      );
    }

    if (paymentType.key == "ONLINE_PAYMENT") {
      console.log(coupon);
      coupon.doc.totalCount -= 1;
      coupon.doc.subCount += 1;
      coupon.doc = await coupon.doc.save();
    }
    subscripe.doc.coupon = coupon.doc;
    subscripe.doc.account
      ? (subscripe.doc.account =
          paymentType.key == "ONLINE_PAYMENT"
            ? await AppCreditModel.findById(subscripe.doc.account)
            : await AppBankModel.findById(subscripe.doc.account))
      : "";
    subscripe = new Subscription(subscripe.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: subscripe,
      error: null,
    });
  },

  async checkSubscription(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id;
    let coupon = req.params.id;
    let subscription = await subscriptionModule.getUserSubscripe(id, coupon);
    if (!subscription) {
      return res.status(404).send({
        isSuccessed: false,
        data: null,
        error:
          req.headers.lang == "en"
            ? "Subscription not Found"
            : "غير مشترك في هذا الكوبون",
      });
    }
    subscription.account
      ? (subscription.account =
          subscription.paymentType.key == "ONLINE_PAYMENT"
            ? await AppCreditModel.findById(subscription.account)
            : await AppBankModel.findById(subscription.account))
      : "";
    subscription = new Subscription(subscription);
    return res.status(201).send({
      isSuccessed: true,
      data: subscription,
      error: null,
    });
  },

  async getAllSubscriptions(req, res, next) {
    let auth = req.headers.authentication;
    let id = auth.id,
      user = null,
      provider = null;
    if (auth.type == "CLIENT") user = id;
    else provider = id;
    let subscriptions = await subscriptionModule.getSubscriptions(
      user,
      provider,
      null,
      null,
      null
    );
    for (let i = 0; i < subscriptions.length; i++) {
      subscriptions[i] = subscriptions[i].toObject();
      subscriptions[i].account
        ? (subscriptions[i].account =
            subscriptions[i].paymentType.key == "ONLINE_PAYMENT"
              ? await AppCreditModel.findById(subscriptions[i].account + "")
              : await AppBankModel.findById(subscriptions[i].account + ""))
        : "";
      console.log("subbb:  ", subscriptions[i].account);
    }
    subscriptions = subscriptions.map((subscription) => {
      return new Subscription(subscription);
    });
    return res.status(201).send({
      isSuccessed: true,
      data: subscriptions,
      error: null,
    });
  },
};
export { subscriptionContoller };
