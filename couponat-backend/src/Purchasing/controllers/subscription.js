import boom from "@hapi/boom";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { CouponModule } from "../../Coupons/modules/coupon";
import { Subscription } from "../../middlewares/responsHandler";
import { ClientModule } from "../../Users/modules/client";
import { ProviderModule } from "../../Users/modules/provider";
import { decodeToken } from "../../utils/JWTHelper";
import { AppBankModel } from "../models/appBanks";
import { AppCreditModel } from "../models/appCridit";
import { paymentTypeModule } from "../modules/paymentType";
import { subscriptionModule } from "../modules/subscription";

let subscriptionContoller = {
  async subscripe(req, res, next) {
    let subscription = req.body;
    let auth = await decodeToken(req.headers.authentication);
    let coupon = await CouponModule.getById(subscription.coupon);
    console.log("as: ", coupon);
    if (coupon.err || !coupon.doc) {
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
      return next(subscripe.err);
    }

    if (paymentType.key == "ONLINE_PAYMENT") {
      console.log(coupon);
      coupon.doc.totalCount -= 1;
      coupon.doc.subCount += 1;
      coupon.doc = await coupon.doc.save();
    }
    // subscripe.doc = subscripe.doc.toObject();
    // paymentType.key == "ONLINE_PAYMENT"
    //   ? (subscripe.doc.account = await AppCreditModel.findById(
    //       subscripe.doc.account
    //     ))
    //   : "";
    // paymentType.key == "BANK_TRANSFER"
    //   ? (subscripe.doc.account = await AppBankModel.findById(
    //       subscripe.doc.account
    //     ))
    //   : "";
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
    // subscription = subscription.toObject();
    // subscription.paymentType.key == "ONLINE_PAYMENT"
    //   ? (subscription.account = await AppCreditModel.findById(
    //       subscription.account
    //     ))
    //   : "";
    // subscription.paymentType.key == "BANK_TRANSFER"
    //   ? (subscription.account = await AppBankModel.findById(
    //       subscription.account
    //     ))
    //   : "";
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

    subscriptions = subscriptions.map((subscription) => {
      // subscription = subscription.toObject();
      // subscription.paymentType.key == "ONLINE_PAYMENT"
      //   ? (subscription.account = await AppCreditModel.findById(
      //       subscription.account
      //     ))
      //   : "";
      // subscription.paymentType.key == "BANK_TRANSFER"
      //   ? (subscription.account = await AppBankModel.findById(
      //       subscription.account
      //     ))
      //   : "";
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
