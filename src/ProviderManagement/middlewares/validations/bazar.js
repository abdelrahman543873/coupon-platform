import boom from "@hapi/boom";
import { BazarValidations } from "../../utils/validations/bazar";
import { ProviderModule } from "../../modules/provider";
import { OrderModule } from "../../../Purchasing/modules/order";

const BazarValidationWares = {
  addBazar(req, res, next) {
    // console.log(req.body)
    if (typeof req.body.districtId === "string") {
      let disArr = [];
      disArr.push(req.body.districtId);
      req.body.districtId = disArr;
    }

    if (req.body.paymentType && typeof req.body.paymentType === "string") {
      let paymentType = [];
      paymentType.push(req.body.paymentType);
      req.body.paymentType = paymentType;
    }

    console.log(req.body.creditCard);

    let { error } = BazarValidations.addBazar.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  editBazarInfo(req, res, next) {
    if (!req.body.name) delete req.body.name;

    if (!req.body.slogan) delete req.body.slogan;

    if (!req.body.officeTele) delete req.body.officeTele;

    if (!req.body.businessYearsNumber) delete req.body.businessYearsNumber;

    if (!req.body.lat) delete req.body.lat;

    if (!req.body.lng) delete req.body.lng;

    if (!req.body.facebookLink) delete req.body.facebookLink;

    if (!req.body.instaLink) delete req.body.instaLink;

    if (!req.body.websiteLink) delete req.body.websiteLink;

    if (!req.body.cityId) delete req.body.cityId;
    else {
      if (!req.body.districtId) {
        let errMsg = lang == "en" ? "district required!" : "المنطقة مطلوبة";
        return next(boom.badData(errMsg));
      }
    }

    if (!req.body.districtId) delete req.body.districtId;
    else {
      if (!req.body.cityId) {
        let errMsg = lang == "en" ? "city required!" : "المدينة مطلوبة";
        return next(boom.badData(errMsg));
      }
      if (typeof req.body.districtId === "string") {
        let disArr = [];
        disArr.push(req.body.districtId);
        req.body.districtId = disArr;
      }
    }

    console.log(req.body);
    if (req.body === {}) return next(boom.badData(error.details[0].message));

    let { error } = BazarValidations.editeBazarInfo.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  addBankAccount(req, res, next) {
    let { error } = BazarValidations.addBank.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  addCreditCard(req, res, next) {
    let { error } = BazarValidations.addCredit.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  editPaymentTypes(req, res, next) {
    let { error } = BazarValidations.editPayments.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },

  async changeOrderState(req, res, next) {
    let orderId = req.params.orderId;
    let providerId = req.params.id;
    let order = await OrderModule.getById(orderId);
    let provider = await ProviderModule.getById(providerId);

    if (!order) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    if (provider.bazar._id+"" != order.bazar+"") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Order Not Found" : " الطلب غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    let { error } = BazarValidations.changeOrderState.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};

export { BazarValidationWares };
