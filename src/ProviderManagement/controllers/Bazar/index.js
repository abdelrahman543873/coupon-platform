import boom from "@hapi/boom";
import { BazarModule } from "../../modules/bazar";
import { ProviderModule } from "../../modules/provider";
import { getErrorMessage } from "../../../utils/handleDBError";
import { CityModule } from "../../../Admin&PlatformSpec/modules/city";
import { hashPass, bcryptCheckPass } from "../../../utils/bcryptHelper";
import { BazarModel } from "../../models/bazar";
import { OrderModule } from "../../../Purchasing/modules/order";
import { Messages } from "../../../utils/twilloHelper";
import { getSMSToken } from "../../../utils/SMSToken";
import { VerificationsModule } from "../../../CustomersManagement/modules/verifications";
import { ClientModule } from "../../../CustomersManagement/modules/client";
import { CouponPayModule } from "../../../Purchasing/modules/couponPayment";
import { NotificationModule } from "../../../CloudMessaging/module/notification";
import { QuestionModule } from "../../../Admin&PlatformSpec/modules/familiarQuestions";
import { AdsPackagesModule } from "../../../Admin&PlatformSpec/modules/adsPackages";

const BazarControllers = {
  async addBazar(req, res, next) {
    let bazar = req.body,
      lang = req.headers.lang || "ar";
    bazar.isBazarAccepted = false;
    bazar.provider = req.params.id;

    if (req.file) {
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/providers-management/bazars/bazars-images/" +
        req.file.filename;
      bazar.logoURL = imgURL;
    }

    let city = await CityModule.getById(bazar.cityId);
    if (!city) {
      let errMsg =
        lang == "en" ? "This city is not found!" : "هذه المدينه غير موجوده";
      return next(boom.badData(errMsg));
    }

    let districtAsArr = searchDistricts(city.districts, bazar.districtId);
    if (districtAsArr.length < 0) {
      let errMsg =
        lang == "en" ? "This district is not found!" : "هذه المنطقه غير موجوده";
      return next(boom.badData(errMsg));
    }

    let savedBazar = await BazarModule.add(bazar);
    if (savedBazar.err)
      return next(
        boom.badData(getErrorMessage(savedBazar.err, req.headers.lang || "ar"))
      );

    let updateProvider = await ProviderModule.updateBazarID(
      savedBazar.doc.provider,
      savedBazar.doc._id
    );

    if (updateProvider.err)
      return next(
        boom.badData(
          getErrorMessage(updateProvider.err, req.headers.lang || "ar")
        )
      );

    return res.status(201).send({
      isSuccessed: true,
      data: savedBazar.doc,
      error: null,
    });
  },
  // query strings type, wProvider, cntItms, featured
  async getBazars(req, res, next) {
    console.log("her");
    let type = req.query.type,
      populatProvider = req.query.wProvider || true,
      countItems = req.query.cntItms || true,
      wAds = req.query.featured == "true" ? true : false;

    let bazars = await BazarModule.getBazars(
      type,
      populatProvider,
      countItems,
      wAds
    );
    let newBazars = [];
    for (let i = 0; i < bazars.bazars.length; i++) {
      if (bazars.bazars[i].type != "COUPONS_PROVIDER") {
        newBazars.push(bazars.bazars[i]);
      }
    }
    bazars.bazars = newBazars;
    //bazars =await bazars.populate("paymentType").execPopulate();

    return res.status(200).send({
      isSuccessed: true,
      data: bazars,
      error: null,
    });
  },
  // query strings skip default 0, limit default 0, n default value "" stands for n
  async searchBazars(req, res, next) {
    let skip = parseInt(req.query.skip) || 0,
      limit = parseInt(req.query.limit) || 0,
      n = req.query.n || "";
    let bazars = await BazarModule.searchBazars(skip, limit, n);
    res.status(200).send({
      isSuccessed: true,
      data: bazars,
      error: null,
    });
  },

  async addResource(req, res, next) {
    let adminID = req.params.id,
      {
        username,
        email,
        countryCode,
        phone,
        password,
        gender,
        roles,
      } = req.body,
      imgURL = "",
      bazar = await BazarModule.getBazarByProvider(adminID),
      bazarId = bazar._id;
    email = email.toLowerCase();

    if (req.file) {
      imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/providers-management/providers/providers-images/" +
        req.file.filename;
    }
    let hashedPass = await hashPass(password);
    let { doc, err } = await ProviderModule.add(
      username,
      email,
      countryCode,
      phone,
      hashedPass,
      imgURL,
      gender,
      roles
    );

    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));

    let resource = doc.toObject(),
      resourceId = resource._id;

    let addResource = await BazarModule.updateResources(bazarId, resourceId);
    if (addResource.err)
      return next(
        boom.badData(
          getErrorMessage(updateProvider.err, req.headers.lang || "ar")
        )
      );

    let updateProvider = await ProviderModule.updateBazarID(
      resourceId,
      bazarId
    );
    if (updateProvider.err)
      return next(
        boom.badData(
          getErrorMessage(updateProvider.err, req.headers.lang || "ar")
        )
      );

    return res.status(201).send({
      isSuccessed: true,
      data: resource,
      error: null,
    });
  },

  async getResources(req, res, next) {
    let bazarId = req.query.bazarId;
    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId);
    console.log(provider);

    if (provider.bazar._id + "" !== bazarId) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Provider" : "صاحب المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    if (!provider.roles.includes("BAZAR_CREATOR")) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    let resources = await ProviderModule.getResources(bazarId),
      resourcesArr = [];

    return res.status(200).send({
      isSuccessed: true,
      data: resources,
      error: null,
    });
  },

  async setActivation(req, res, next) {
    let id = req.body.resourceID,
      isActive = req.body.isActive;
    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId),
      resource = await ProviderModule.getById(id);
    console.log(provider);
    if (provider.bazar._id + "" !== resource.bazar._id + "") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong resource" : "المورد غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    if (!provider.roles.includes("BAZAR_CREATOR")) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    let updateResource = await ProviderModule.setResourceOnOff(id, isActive);
    console.log(updateResource);

    return res.status(200).send({
      isSuccessed: true,
      data: updateResource,
      error: null,
    });
  },

  async deleteResource(req, res, next) {
    let id = req.body.resourceID;
    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId),
      resource = await ProviderModule.getById(id);

    if (provider.bazar._id + "" !== resource.bazar._id + "") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Provider" : "صاحب المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    if (!provider.roles.includes("BAZAR_CREATOR")) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    let delet = await ProviderModule.deleteResource(id);
    return res.status(200).send({
      isSuccessed: true,
      data: delet,
      error: null,
    });
  },
  async updateResourcePersonal(req, res, next) {
    let id = req.query.resourceID;
    let newData = req.body;

    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId),
      resource = await ProviderModule.getById(id);

    if (provider.bazar._id + "" !== resource.bazar._id + "") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Provider" : "صاحب المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    if (!provider.roles.includes("BAZAR_CREATOR")) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    if (req.file) {
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/providers-management/providers/providers-images/" +
        req.file.filename;
      newData.imgURL = imgURL;
    }

    let update = await ProviderModule.updateProviderPersonal(id, newData);
    return res.status(200).send({
      isSuccessed: true,
      data: update,
      error: null,
    });
  },

  async changePassword(req, res, next) {
    let id = req.query.resourceID,
      currentPssword = req.body.currentPassword,
      newPssword = req.body.newPassword;
    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId);
    let user = await ProviderModule.getById(id);
    if (!user) {
      return next(boom.unauthorized(errMsg));
    }

    if (provider.bazar._id + "" !== user.bazar._id + "") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Provider" : "صاحب المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    if (!provider.roles.includes("BAZAR_CREATOR")) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    if (!(await bcryptCheckPass(currentPssword, user.password))) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Password!" : "الباسورد غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    let hashedPass = await hashPass(newPssword);
    let changePassword = await ProviderModule.changePassword(id, hashedPass);
    return res.status(200).send({
      isSuccessed: true,
      data: changePassword,
      error: null,
    });
  },

  async editBazarInfo(req, res, next) {
    let id = req.query.bazarId;
    let newData = req.body;

    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId),
      bazar = await BazarModule.getById(id);

    if (provider.bazar._id + "" !== bazar._id + "") {
      console.log(provider.bazar._id + "," + bazar._id);
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Provider" : "صاحب المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }

    if (!provider.roles.includes("BAZAR_CREATOR")) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    if (req.file) {
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/providers-management/bazars/bazars-images/" +
        req.file.filename;
      newData.logoURL = imgURL;
    }

    if (req.body.cityId) {
      let city = await CityModule.getById(req.body.cityId);
      if (!city) {
        let errMsg =
          lang == "en" ? "This city is not found!" : "هذه المدينه غير موجوده";
        return next(boom.badData(errMsg));
      }
      let districtAsArr = searchDistricts(city.districts, req.body.districtId);
      if (districtAsArr.length < 0) {
        let errMsg =
          lang == "en"
            ? "This district is not found!"
            : "هذه المنطقه غير موجوده";
        return next(boom.badData(errMsg));
      }
    }

    let update = await BazarModule.editBazarInfo(id, newData);
    return res.status(200).send({
      isSuccessed: true,
      data: update,
      error: null,
    });
  },

  async getAvailablePayment(req, res, next) {
    let type = req.query.type;
    let payment = await BazarModule.getAvailblePayment();
    if (type == "COUPONS_PROVIDER"||type=="AD_PAYMENT") {
      for (let i = 0; i < payment.length; i++) {
        if (payment[i].key == "COD") {
          payment.splice(i, 1);
        }
      }
    }

    return res.status(200).send({
      isSuccessed: true,
      data: payment,
      error: null,
    });
  },

  async addBanckAccount(req, res, next) {
    let account = req.body;
    let bazar = await BazarModule.getById(account.bazar);

    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar Not Found!" : "المتجر غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let saveAccount = await BazarModule.addBankAccount(account);
    if (saveAccount.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: saveAccount.err,
      });
    }
    console.log(bazar);
    bazar.bankAccount.push(saveAccount.bank._id);
    bazar = await bazar.save();
    console.log(saveAccount.bank);
    bazar = await bazar
      .populate("bankAccount")
      .populate("creditCard")
      .execPopulate();
    return res.status(200).send({
      isSuccessed: true,
      data: bazar,
      error: null,
    });
  },

  async addCreditCard(req, res, next) {
    let card = req.body;
    let bazar = await BazarModule.getById(card.bazar);

    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar Not Found!" : "المتجر غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let saveCard = await BazarModule.addCreditCard(card);
    if (saveCard.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: saveCard.err,
      });
    }

    bazar.creditCard = saveCard.card._id;
    bazar = await bazar.save();
    bazar = await bazar
      .populate("bankAccount")
      .populate("creditCard")
      .execPopulate();
    return res.status(200).send({
      isSuccessed: true,
      data: bazar,
      error: null,
    });
  },

  async editPayments(req, res, next) {
    let { bazar, paymentType } = req.body;
    let bazars = await BazarModule.getById(bazar);

    if (!bazars) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar Not Found!" : "المتجر غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let { err, data } = await BazarModule.editPaymentWay(bazar, paymentType);

    if (err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    }
    return res.status(200).send({
      isSuccessed: true,
      data: data,
      error: null,
    });
  },

  async toggleBankAccount(req, res, next) {
    let { bazar, state } = req.body;
    let bankId = req.params.bankId;
    let bazars = await BazarModule.getById(bazar);

    if (!bazars) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar Not Found!" : "المتجر غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let { err, data } = await BazarModule.toggleBankAccount(
      bazar,
      bankId,
      state
    );

    if (err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    }

    return res.status(200).send({
      isSuccessed: true,
      data: data,
      error: null,
    });
  },

  async changeOrderState(req, res, next) {
    let orderId = req.params.orderId;
    let state = req.body.state;
    let note = req.query.note || null;
    let smsToken = null;
    let changeState = await OrderModule.changeState(orderId, state, note);

    if (changeState.err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: changeState.err,
      });
    }
    let client = await ClientModule.getById(changeState.clientId);
    if (!client) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: "No clint found for this order",
      });
    }
    if (state == "SHIPPED TO USER ADDRESS") {
      smsToken = getSMSToken(5);
      let addToVerificationRes = await VerificationsModule.add(
        client._id,
        smsToken,
        client.countryCode,
        client.mobile
      );
      console.log(addToVerificationRes);
      if (addToVerificationRes.err)
        return next(
          boom.badData(getErrorMessage(err, req.headers.lang || "ar"))
        );
      let lang = req.headers.lang || "ar";
      if (client.fcmToken) {
        let notification = {
          titleEn: "Order tracking",
          titleAr: "تحديثات الطلب",
          bodyEn: "your Order is Shipped, please confirm with code " + smsToken,
          bodyAr:
            "طلبك تم شحنه من فضلك اكد وصوله بسلام عن طريق ادخال الرمز " +
            smsToken,
          data: changeState._id,
          action: "view_order",
          user: client._id,
          lang: lang,
        };
        let sentNotification = await NotificationModule.sendOrderNotification(
          client.fcmToken,
          notification
        );
      }

      // smsToken = await Messages.sendMessage(
      //   client.mobile,
      //   lang == "en"
      //     ? "Bazaar app: your Order is Shipped, please confirm with code  "
      //     : "تطبيق بازار : طلبك تم شحنه من فضلك اكد وصوله بسلام عن طريق ادخال الرمز  " +
      //         smsToken
      // );
    } else if (state == "REFUSED") {
      let lang = req.headers.lang || "ar";
      if (client.fcmToken) {
        let notification = {
          titleEn: "Order tracking",
          titleAr: "تحديثات الطلب",
          bodyEn: "your order refused from bazar",
          bodyAr: "تم رفض طلبك برجاء مراجعة المتجر",
          data: changeState._id,
          action: "view_order",
          user: client._id,
          lang: lang,
        };

        let sentNotification = await NotificationModule.sendOrderNotification(
          client.fcmToken,
          notification
        );
      }
      // smsToken = await Messages.sendMessage(
      //   client.mobile,
      //   lang == "en"
      //     ? "your order refused from bazar"
      //     : "تطبيق بازار : تم رفض طلبك برجاء مراجعة المتجر"
      // );
    }
    return res.status(201).send({
      isSuccessed: true,
      data: {
        changeState,
        smsToken,
        //sentNotification,
      },
      error: null,
    });
  },

  async getOrderStatistics(req, res, next) {
    let bazar = req.params.bazar;

    let statistics = await BazarModule.getOrderStatistics(bazar);


    return res.status(201).send({
      isSuccessed: true,
      data: statistics,
      error: null,
    });
  },
  async getConsumedCoupons(req, res, next) {
    let providerId = req.params.id;
    let bazarId = req.params.bazar;
    let clientId = req.query.clientId || null;
    let confirmed = req.query.confirmed || null;
    let expired = req.query.expired || false;

    let provider = await ProviderModule.getById(providerId);
    if (!provider) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "provider not found!" : "المستخدم غير موجود";
      return next(boom.badData(errMsg));
    }

    let bazar = await BazarModule.getById(bazarId);
    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "bazar not found!" : "المتجر غير موجود";
      return next(boom.badData(errMsg));
    }

    let coupons = await CouponPayModule.getConsumedCoupons(
      clientId,
      bazarId,
      expired,
      confirmed,
      true,
      false
    );
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  async confirmCouponPayment(req, res, next) {
    let couponPayId = req.params.paymentId;
    let confirm = req.query.confirm || true;
    let note = req.query.note || null;
    let couponPayment = await CouponPayModule.getById(couponPayId);

    if (!couponPayment) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Payment not found!" : "دفع الكوبون غير موجود";
      return next(boom.badData(errMsg));
    }

    if (confirm == true) couponPayment.isConfirmed = true;
    else {
      couponPayment.note = note;
    }
    couponPayment = await couponPayment.save();
    return res.status(201).send({
      isSuccessed: true,
      data: couponPayment,
      error: null,
    });
  },
  async getFamiliarQuestions(req, res, next) {
    let lang = req.headers.lang || "ar";
    let questions = await QuestionModule.getQuestions("PROVIDER", lang);
    return res.status(200).send({
      isSuccessed: true,
      data: questions,
      error: null,
    });
  },

  async getAdsPackages(req, res, next) {
    let packages = await AdsPackagesModule.getPackages(true);
    return res.status(200).send({
      isSuccessed: true,
      data: packages,
      error: null,
    });
  },
  async getCouponsStatistics(req, res, next) {
    let bazar = req.params.bazar;

    let statistics = await BazarModule.getCouponStatistics(bazar);

    return res.status(201).send({
      isSuccessed: true,
      data: statistics,
      error: null,
    });
  },
};

function searchDistricts(districts, districtId) {
  return districts.filter((district) => district._id + "" == districtId);
}

export { BazarControllers };
