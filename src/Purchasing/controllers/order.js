import { OrderModule } from "../modules/order";
import { ClientModule } from "../../CustomersManagement/modules/client";
import { BazarModule } from "../../ProviderManagement/modules/bazar";
import boom from "@hapi/boom";
import { AddressesModule } from "../modules/addresses";
import { Messages } from "../../utils/twilloHelper";
import { PeymentTypeModel } from "../../Admin&PlatformSpec/models/paymentType";
import { VerificationsModule } from "../../CustomersManagement/modules/verifications";
import { NotificationModule } from "../../CloudMessaging/module/notification";
import { ProviderModule } from "../../ProviderManagement/modules/provider";
import { PaymentModule } from "../modules/payment";
let OrderContoller = {
  async addOrder(req, res, next) {
    let clientId = req.params.id,
      { products, bazar, total, paymentType, deliveryAddress } = req.body;

    let client = await ClientModule.getById(clientId);
    let bazars = await BazarModule.getById(bazar);
    let address = await AddressesModule.getAddressById(
      deliveryAddress,
      clientId
    );

    if (!client) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Client not found!" : " العميل غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    if (!bazars) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar not found" : " المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    let provider = await ProviderModule.getById(bazars.provider);

    if (!address) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Address Not Found" : " العنوان غير صحيح";
      return next(boom.unauthorized(errMsg));
    }
    let { err, data } = await OrderModule.addOrder(
      products,
      clientId,
      bazar,
      total,
      paymentType,
      deliveryAddress
    );

    if (err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    }
    let tokens = await BazarModule.getFcmTokens(bazar, "BAZAR_ORDER_HANDLER");
    console.log(tokens);
    if (tokens.length>0) {
      let lang = req.headers.lang || "ar";
      let notification = {
        titleAr: "طلب جديد",
        titleEn: "New Order",
        bodyAr: "حصل متجرك على طلب جديد",
        bodyEn: "Your bazar get new Order",
        data: data._id,
        action: "view_order",
        user: bazar,
        lang: lang,
      };
      let sentNotification = await NotificationModule.sendBazarOrderNotification(
        tokens,
        notification
      );
      console.log(sentNotification)
    }
    return res.status(201).send({
      isSuccessed: true,
      data: data,
      error: null,
    });
  },

  async getOrder(req, res, next) {
    let id = req.params.id;

    let order = await OrderModule.getById(id);
    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    order = await order
      .populate("clientId")
      .populate("bazar")
      .populate("products.product")
      .populate("paymentType")
      .execPopulate();

    order = await order
      .populate("bazar.bankAccount")
      .populate("bazar.creditCard")
      .execPopulate();

    order = order.toObject();
    order.deliveryAddress = await AddressesModule.getAddressById(
      order.deliveryAddress,
      order.clientId._id
    );

    return res.status(200).send({
      isSuccessed: true,
      data: order,
      error: null,
    });
  },

  async getPayment(req, res, next) {
    let id = req.params.id;

    let payment = await PaymentModule.getById(id);
    if (!payment) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Payment Not Found" : " عملية الدفع غير موجودة";
      return next(boom.unauthorized(errMsg));
    }

    payment = await payment
      .populate("order")
      .populate("accountId")
      .execPopulate();

    payment = await payment
      .populate("order.clientId")
      .populate("order.bazar")
      .populate("order.products.product")
      .execPopulate();
    return res.status(200).send({
      isSuccessed: true,
      data: payment,
      error: null,
    });
  },

  async getOrders(req, res, next) {
    let clientId = req.params.id,
      state = req.query.state || null;
    let orders = await OrderModule.getOrders(
      clientId,
      state,
      null,
      false,
      true
    );

    for (let i = 0; i < orders.length; i++) {
      orders[i] = await orders[i].populate("bazar").execPopulate();

      orders[i] = await orders[i]
        .populate("bazar.bankAccount")
        .populate("bazar.creditCard")
        .execPopulate();
      orders[i] = orders[i].toObject();
      orders[i].deliveryAddress = await AddressesModule.getAddressById(
        orders[i].deliveryAddress,
        clientId
      );
      console.log("sdasdasdasd");
      console.log(orders[i].deliveryAddress);
    }

    return res.status(201).send({
      isSuccessed: true,
      data: orders || [],
      error: null,
    });
  },

  async orderCanceling(req, res, next) {
    let orderId = req.params.id;
    let order = await OrderModule.getById(orderId);

    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    let bazar = await BazarModule.getById(order.bazar);
    let provider = await ProviderModule.getById(bazar.provider);
    let cancel = await OrderModule.changeState(orderId, "CANCELED");
    let tokens = await BazarModule.getFcmTokens(
      order.bazar,
      "BAZAR_ORDER_HANDLER"
    );
    console.log(tokens);
    if (tokens.length > 0) {
      let lang = req.headers.lang || "ar";
      let notification = {
        titleAr: "تحديثات الطلب",
        titleEn: "Order tracking",
        bodyAr: "لقد الغى العميل الطلب رقم " + order.code,
        bodyEn: "Client canceled order with code " + order.code,
        data: cancel._id,
        action: "view_order",
        user:order.bazar,
        lang: lang,
      };
      let sentNotification = await NotificationModule.sendBazarOrderNotification(
        tokens,
        notification
      );
    }
    return res.status(201).send({
      isSuccessed: true,
      data: cancel,
      error: null,
    });
  },

  async orderConfirmation(req, res, next) {
    let orderId = req.params.order;
    let order = await OrderModule.getById(orderId);
    let smsMessage = "";

    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let client = await ClientModule.getById(order.clientId);
    if (!client) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Client Not Found" : " العميل غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    let payment = await PeymentTypeModel.findById(order.paymentType);
    if (!payment) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "Payment Type Not Found" : " طريقة الدفع غير موجودة";
      return next(boom.unauthorized(errMsg));
    }

    order.isConfirmed = true;

    if (payment.key == "COD") {
      let lang = req.headers.lang || "ar";
      order.state = "ACCEPTED";
      smsMessage =
        lang == "en"
          ? "Bazazr App: Your Order Confirmed and will shipped to your Address Soon."
          : "تطبيق بازار : تم تاكيد طلبك و سوف يتم شحنه الى عنوانك قريبا";

      if (client.fcmToken) {
        let lang = req.headers.lang || "ar";
        let notification = {
          titleAr: "تحديثات الطلب",
          bodyAr: "تم تاكيد طلبك و سوف يتم شحنه الى عنوانك قريبا ",
          titleEn: "Order tracking",
          bodyEn: "Your Order Confirmed and will shipped to your Address Soon ",
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
    } else {
      let lang = req.headers.lang || "ar";

      order.state = "PAYMENT PENDING";
      smsMessage =
        lang == "en"
          ? "Bazaar App: Your Order Confirmed and Payment Pending, please Pay."
          : "تطبيق بازار : تم تاكيد طلبك و في انتظار الدفع, من فضلك ادفع";

      if (client.fcmToken) {
        let lang = req.headers.lang || "ar";
        let notification = {
          titleAr: "تحديثات الطلب",
          bodyAr: "تم تاكيد طلبك و في انتظار الدفع, من فضلك ادفع ",
          titleEn: "Order tracking",
          bodyEn: "Your Order Confirmed and Payment Pending, please Pay ",
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
    }
    order = await order.save();
    // smsMessage = await Messages.sendMessage(client.mobile, smsMessage);

    return res.status(201).send({
      isSuccessed: true,
      data: order,
      error: null,
    });
  },

  async getBazarPaymentWays(req, res, next) {
    let paymentType = await OrderModule.getBazarPaymentWays(req.params.id);
    return res.status(201).send({
      isSuccessed: true,
      data: paymentType,
      error: null,
    });
  },

  async confirmDeliverdOrder(req, res, next) {
    let code = req.body.smsToken,
      id = req.params.id;
    let orderId = req.body.order;

    let order = await OrderModule.getById(orderId);
    if (!order) {
      let errMsg =
        req.headers.lang == "en" ? "Order not Found!" : "الطلب غير موجود";
      return next(boom.notFound(errMsg));
    }
    let verification = await VerificationsModule.get(id, code);
    console.log(verification);
    if (verification.err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    if (!verification.doc) {
      let errMsg =
        req.headers.lang == "en"
          ? "No previous record for this token!, add phone number or check the token please"
          : "لا يوجد بيانات سابقه لهذا الرمز فى التحقيقات";
      return next(boom.notFound(errMsg));
    }
    order.state = "DELIVERED";
    order = await order.save();

    let bazar = await BazarModule.getById(order.bazar);
    let provider = await ProviderModule.getById(bazar.provider);
    let tokens = await BazarModule.getFcmTokens(
      order.bazar,
      "BAZAR_ORDER_HANDLER"
    );
    console.log(tokens);
    if (tokens.length > 0) {
      let lang = req.headers.lang || "ar";
      let notification = {
        titleAr: "تحديثات الطلب",
        bodyAr: `تم تأكيد وصول الطلب رقم ${order.code} الى العميل بنجاح`,
        titleEn: "Order tracking",
        bodyEn: `Client Confirm delivering for Order with code ${order.code}`,
        data: order._id,
        action: "view_order",
        user: order.bazar,
        lang: lang,
      };
      let sentNotification = await NotificationModule.sendBazarOrderNotification(
        tokens,
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
export { OrderContoller };
