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
import { NotificationModule } from "../../CloudMessaging/module/notification";

let subscriptionContoller = {
  async subscripe(req, res, next) {
    let subscription = req.body;
    let auth = await decodeToken(req.headers.authentication);
    let coupon = await CouponModule.getById(subscription.coupon);
    console.log("as: ", coupon);
    if (!coupon || coupon.totalCount <= 0) {
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
      if (paymentType.key == "BANK_TRANSFER" && !account.isActive) {
        let lang = req.headers.lang || "ar",
          errMsg =
            lang == "en" ? "account not Active" : "حساب التحويل غير مفعل";
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
      subscription.code,
      {
        color: {
          dark: "#575757", // Blue dots
          light: "#0000", // Transparent background
        },
      }
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
      coupon.totalCount -= 1;
      coupon.subCount += 1;
      coupon = await coupon.save();
    }
    subscripe.doc.coupon = coupon;
    subscripe.doc.account
      ? (subscripe.doc.account =
          paymentType.key == "ONLINE_PAYMENT"
            ? await AppCreditModel.findById(subscripe.doc.account)
            : await AppBankModel.findById(subscripe.doc.account))
      : "";
    subscripe = new Subscription(subscripe.doc);

    if (paymentType.key == "ONLINE_PAYMENT" || paymentType.key == "CASH") {
      await NotificationModule.newSubscriptionNotification(
        req.headers.lang,
        {
          id: subscripe.coupon.provider.id,
          fcmToken: subscripe.coupon.provider.fcmToken || "",
        },
        subscripe.coupon.name,
        subscripe.id
      );
    } else if (paymentType.key == "BANK_TRANSFER") {
      console.log("Here nowwwwwwwwwww");
      await NotificationModule.bankTransferNotification(
        req.headers.lang,
        subscripe.id
      );
    }
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
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id,
      user = null,
      provider = null;
    console.log("here naoe: ", auth);
    if (auth.type == "CLIENT") user = id;
    else provider = id;
    let subscriptions = await subscriptionModule.getSubscriptions(
      user,
      provider,
      null,
      null,
      null
    );
    user = await ClientModule.getById(user);
    console.log("User: ", user);
    for (let i = 0; i < subscriptions.length; i++) {
      subscriptions[i] = subscriptions[i].toObject();
      subscriptions[i].account
        ? (subscriptions[i].account =
            subscriptions[i].paymentType.key == "ONLINE_PAYMENT"
              ? await AppCreditModel.findById(subscriptions[i].account + "")
              : await AppBankModel.findById(subscriptions[i].account + ""))
        : "";

      subscriptions[i] = new Subscription(subscriptions[i], auth.type);
      if (user) {
        subscriptions[i].coupon = await addFavProp(
          [subscriptions[i].coupon],
          user.favCoupons
        );
        subscriptions[i].coupon = subscriptions[i].coupon[0];
        console.log("subbb:  ", subscriptions[i].coupon);
        console.log("Fav:  ", user.favCoupons);
        let sub = await subscriptionModule.getUserSubscripe(
          user._id,
          subscriptions[i].coupon.id
        );
        subscriptions[i].coupon.isSubscribe = sub ? true : false;
      }
    }
    return res.status(201).send({
      isSuccessed: true,
      data: subscriptions,
      error: null,
    });
  },

  async getUnconfirmed(req, res, next) {
    let subscriptions = await subscriptionModule.getSubscriptions(
      null,
      null,
      null,
      false,
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
      return new Subscription(subscription, "PROVIDER");
    });
    return res.status(201).send({
      isSuccessed: true,
      data: subscriptions,
      error: null,
    });
  },

  async confirmPayment(req, res, next) {
    let subscribeId = req.params.id;
    let { decision, note } = req.body;
    let subscribe = await subscriptionModule.getById(subscribeId);
    if (!subscribe || subscribe.isUsed == true) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "Subscription not found" : "عملية الاشتراك غير موجودة";
      return next(boom.notFound(errMsg));
    }

    if ((decision == "false" || decision == false) && !note) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en"
            ? "Must to send note to Client"
            : "يجب إرسال ملاحظة توضيح سبب الرفض";
      return next(boom.notFound(errMsg));
    }

    if (decision == true || decision == "true") {
      subscribe.isConfirmed = decision;
      subscribe.isPaid = true;
      let coupon = await CouponModule.getById(subscribe.coupon._id);
      coupon.totalCount = coupon.totalCount - 1;
      coupon.subCount = coupon.subCount + 1;
      coupon = await coupon.save();
    } else subscribe.note = note;

    subscribe = await subscribe.save();
    subscribe = new Subscription(subscribe, "PROVIDER");

    await NotificationModule.confirmNotification(
      req.headers.lang,
      {
        id: subscribe.user.id,
        fcmToken: subscribe.user.fcmToken || "",
      },
      {
        id: subscribe.id,
        decision: decision == true || decision == "true" ? true : false,
      }
    );

    return res.status(201).send({
      isSuccessed: true,
      data: subscribe,
      error: null,
    });
  },

  async scan(req, res, next) {
    let code = req.params.code;
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;

    let subscribe = await subscriptionModule.scan(id, code);
    if (!subscribe) {
      return res.status(404).send({
        isSuccessed: false,
        data: null,
        error:
          req.headers.lang == "en"
            ? "Subscribtion not Found"
            : "عملية الاشتراك غير موجودة",
      });
    }

    subscribe = new Subscription(subscribe, "PROVIDER");

    return res.status(200).send({
      isSuccessed: true,
      data: subscribe,
      error: null,
    });
  },

  async confirmUsage(req, res, next) {
    let id = req.params.id;
    let subscribe = await subscriptionModule.getById(id);
    if (!subscribe || subscribe.isUsed == true) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "Subscription not found" : "عملية الاشتراك غير موجودة";
      return next(boom.notFound(errMsg));
    }
    subscribe.isUsed = true;
    subscribe.isPaid = true;
    subscribe = await subscribe.save();

    if (subscribe.paymentType.key == "CASH") {
      let coupon = await CouponModule.getById(subscribe.coupon._id);
      coupon.totalCount = coupon.totalCount - 1;
      coupon.subCount = coupon.subCount + 1;
      coupon = await coupon.save();
      subscribe.coupon = coupon;
    }

    subscribe = new Subscription(subscribe, "PROVIDER");

    await NotificationModule.couponUsedNotification(
      req.headers.lang,
      {
        id: subscribe.user.id,
        fcmToken: subscribe.user.fcmToken || "",
      },
      subscribe.coupon.name,
      subscribe.id
    );
    return res.status(200).send({
      isSuccessed: true,
      data: subscribe,
      error: null,
    });
  },
};

async function addFavProp(coupons, userFav) {
  if (!userFav) {
    return coupons.map((coupon) => {
      return Object.assign(coupon, {
        isFav: false,
      });
    });
  }
  return coupons.map((coupon) => {
    return Object.assign(coupon, {
      isFav: userFav.some((item) => {
        console.log(coupon.id, "---", item);
        console.log(item + "" == coupon.id + "");
        return item + "" == coupon.id + "";
      }),
    });
  });
}
export { subscriptionContoller };
