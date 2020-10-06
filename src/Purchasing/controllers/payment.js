import { OrderModule } from "../modules/order";
import boom from "@hapi/boom";
import { PaymentModule } from "../modules/payment";
import { NotificationModule } from "../../CloudMessaging/module/notification";
import { ClientModule } from "../../CustomersManagement/modules/client";
import { ProviderModule } from "../../ProviderManagement/modules/provider";
import { BazarModule } from "../../ProviderManagement/modules/bazar";
import { Messages } from "../../utils/twilloHelper";

let PaymentController = {
  async addPayment(req, res, next) {
    let payment = req.body,
      order = await OrderModule.getById(payment.order);

    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    if (payment.type == "BANK_TRANSFER") {
      payment.isConfirmed = false;
    }

    if (req.file) {
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/purchasing-management/orders/payments/payments-images/" +
        req.file.filename;
      payment.imgURL = imgURL;
    }

    let { err, data } = await PaymentModule.addPayment(payment);

    if (err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    }
    let bazar = await BazarModule.getById(order.bazar);
    let provider = await ProviderModule.getById(bazar.provider);
    if (payment.type == "ONLINE_PAYMENT") {
      order.paymentId = data._id;
      order.isPaid = true;
      order.state = "ACCEPTED";

      let tokens = await BazarModule.getFcmTokens(
        order.bazar,
        "BAZAR_ORDER_HANDLER"
      );
      console.log(tokens);
      if (tokens.length > 0) {
        let lang = req.headers.lang || "ar";
        let notification = {
          titleAr: "تحديثات الطلب",
          bodyAr: `تمت عملية دفع الطلب رقم ${order.code} بنجاح`,
          titleEn: "Order tracking",
          bodyEn: `Order with code ${order.code} has succeddfuly payment`,
          data: data._id,
          action: "view_payment",
          user: order.bazar,
          lang: lang,
        };
        let sentNotification = await NotificationModule.sendBazarOrderNotification(
          tokens,
          notification
        );
      }
    } else {
      let tokens = await BazarModule.getFcmTokens(
        order.bazar,
        "BAZAR_ORDER_HANDLER"
      );
      console.log(tokens);
      if (tokens.length > 0) {
        let lang = req.headers.lang || "ar";
        let notification = {
          titleAr: "تحديثات الطلب",
          bodyAr: `تم دفع الطلب رقم ${order.code} وفي انتظار المراجعه`,
          titleEn: "Order tracking",
          bodyEn: `Order with code ${order.code} paid and waitng your review.`,
          data: data._id,
          action: "view_payment",
          user: order.bazar,
          lang: lang,
        };
        let sentNotification = await NotificationModule.sendBazarOrderNotification(
          tokens,
          notification
        );
      }
    }
    order = await order.save();

    return res.status(200).send({
      isSuccessed: true,
      data: data,
      error: null,
    });
  },

  async getUnConfirmedPayment(req, res, next) {
    let bazar = req.params.bazar;

    let Payments = await PaymentModule.getPayments(bazar);

    return res.status(200).send({
      isSuccessed: true,
      data: Payments,
      error: null,
    });
  },

  async paymentConfirmation(req, res, next) {
    let id = req.params.payment;
    let payment = await PaymentModule.getById(id);

    if (!payment) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Payment Not Found" : " عملية الدفع غير موجوده";
      return next(boom.unauthorized(errMsg));
    }
    let order = await OrderModule.getById(payment.order);

    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let confirm = await PaymentModule.paymentConfirmation(id);

    order.paymentId = id;
    order.isPaid = true;
    order.state = "ACCEPTED";
    order = await order.save();

    let client = await ClientModule.getById(order.clientId);

    if (client) {
      let smsMessage =
        req.headers.lang == "en"
          ? "Bazazr App: Your Payment Confirmed and Order will shipped to your Address Soon."
          : "تطبيق بازار : تم تاكيد عملية الدفع و سوف يتم شحن طلبك الى عنوانك قريبا";
      //  smsMessage = await Messages.sendMessage(client.mobile, smsMessage);
    }

    if (client.fcmToken) {
      let lang = req.headers.lang || "ar";
      let notification = {
        titleAr: "تحديثات الطلب",
        bodyAr: "تم تاكيد عملية الدفع و سوف يتم شحن طلبك الى عنوانك قريبا",
        titleEn: "Order tracking",
        bodyEn:
          "Bazazr App: Your Payment Confirmed and Order will shipped to your Address Soon",
        data: order._id,
        action: "view_order",
        user: client._id,
        lang: lang,
      };
      let sentNotification = await NotificationModule.sendOrderNotification(
        client.fcmToken,
        notification
      );
    }
    return res.status(200).send({
      isSuccessed: true,
      data: confirm,
      error: null,
    });
  },

  async paymentRejection(req, res, next) {
    let id = req.params.payment;
    let payment = await PaymentModule.getById(id);

    if (!payment) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Payment Not Found" : " عملية الدفع غير موجوده";
      return next(boom.unauthorized(errMsg));
    }
    let order = await OrderModule.getById(payment.order);

    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let reject = await PaymentModule.paymentRejection(id);

    order.paymentId = id;
    order.state = "REFUSED";
    order = await order.save();

    let client = await ClientModule.getById(order.clientId);

    if (client) {
      let smsMessage =
        req.headers.lang == "en"
          ? "Bazazr App: Your Payment Rejected please connect with bazar owner"
          : "تطبيق بازار : تم رفض عملية الدفع برجاء التواصل مع صاحب البزار";
      //   smsMessage = await Messages.sendMessage(client.mobile, smsMessage);
    }

    if (client.fcmToken) {
      let lang = req.headers.lang || "ar";
      let notification = {
        titleAr: "تحديثات الطلب",
        bodyAr: "تم رفض عملية الدفع برجاء التواصل مع صاحب البزار",
        titleEn: "Order tracking",
        bodyEn:
          "Bazazr App: Your Payment Rejected please connect with bazar owner",
        data: order._id,
        action: "view_order",
        user: client._id,
        lang: lang,
      };
      let sentNotification = await NotificationModule.sendOrderNotification(
        client.fcmToken,
        notification
      );
    }
    return res.status(200).send({
      isSuccessed: true,
      data: order,
      error: null,
    });
  },
};
export { PaymentController };
