import boom from "@hapi/boom";
import { getErrorMessage } from "../../../utils/handleDBError";
import { ProductModule } from "../../modules/product";
import { BazarModule } from "../../../ProviderManagement/modules/bazar";
import { ProviderModule } from "../../../ProviderManagement/modules/provider";
import { decodeTokenAndGetType } from "../../../utils/JWTHelper";
import { OfferModule } from "../../modules/offers";
import { NotificationModule } from "../../../CloudMessaging/module/notification";

const OfferController = {
  async addOffer(req, res, next) {
    let {
      discount,
      descAr,
      descEn,
      type,
      bazar,
      product,
      totalDayes,
    } = req.body;

    let bazars = await BazarModule.getById(bazar),
      providerId = bazars.provider,
      provider = await ProviderModule.getById(providerId),
      imgURL = "";

    if (
      !provider.roles.includes("BAZAR_CREATOR") &&
      !provider.roles.includes("BAZAR_PRODUCTS_EDITOR")
    ) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }
    let products = null;
    if (product) {
      products = await ProductModule.getById(product);
      if (!products) {
        let lang = req.headers.lang || "ar",
          errMsg = lang == "en" ? "product not found" : "المنتج غير موجود";
        return next(boom.unauthorized(errMsg));
      }
    }

    if (req.file) {
      imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/products/offers/offers-images/" +
        req.file.filename;
    } else {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "offer image required" : "صورة العرض مطلوبة";
      return next(boom.unauthorized(errMsg));
    }
    let startDate = new Date();
    let endDate = new Date().setDate(
      new Date().getDate() + parseInt(totalDayes)
    );
    console.log("ijsd", imgURL);
    let addOffer = await OfferModule.add(
      discount,
      descAr,
      descEn,
      type,
      bazar,
      product,
      startDate,
      endDate,
      imgURL
    );
    if (addOffer.err) {
      return next(
        boom.badData(getErrorMessage(addOffer.err, req.headers.lang || "ar"))
      );
    }

    if (type == "ONE") {
      console.log("offf: ", products.offer);
      let oldOfferId = products.offer ? products.offer._id : null;
      //console.log("offf: ", oldOfferId);
      if (oldOfferId) {
        let oldOffer = await OfferModule.getById(oldOfferId);
        if (oldOffer.type == "ONE") {
          oldOffer.isDeleted = true;
          oldOffer = await oldOffer.save();
        }
        console.log("after:", oldOffer);
      }
      products.offer = addOffer.doc._id;
      products = await products.save();
    } else {
      let oldOfferArray = [];
      let productsList = await ProductModule.getStoreProducts(bazar);
      console.log("1", addOffer.doc);
      for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].offer) oldOfferArray.push(productsList[i].offer);
        productsList[i].offer = addOffer.doc._id;
        productsList[i] = await productsList[i].save();
        console.log("2", productsList[i]);
      }

      oldOfferArray = Array.from(new Set(oldOfferArray));
      console.log("3", oldOfferArray);
      for (let i = 0; i < oldOfferArray.length; i++) {
        let oldOfferObject = await OfferModule.getById(oldOfferArray[i]);
        oldOfferObject.isDeleted = true;
        oldOfferObject = await oldOfferObject.save();
        console.log("4", oldOfferObject);
      }
    }

    let sendNotification = await NotificationModule.offerNotification(
      addOffer.doc._id,
      req.headers.lang || "ar",
      bazars.name
    );
    console.log(sendNotification);
    return res.status(201).send({
      isSuccessed: true,
      data: addOffer.doc,
      error: null,
    });
  },

  async getOffers(req, res, next) {
    let offers = await OfferModule.getOffers();
    for (let i = 0; i < offers.length; i++) {
      offers[i] = await offers[i]
        .populate("product.bazar", "name logoURL")
        .execPopulate();
    }
    return res.status(200).send({
      isSuccessed: true,
      data: offers,
      error: null,
    });
  },

  async getStoreOffers(req, res, next) {
    let bazarId = req.params.id,
      bazar = await BazarModule.getById(bazarId);
    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? " Bazar not found" : " المحل غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    let offers = await OfferModule.getByBazar(bazarId);
    return res.status(200).send({
      isSuccessed: true,
      data: offers,
      error: null,
    });
  },

  async deleteOffer(req, res, next) {
    let offerId = req.params.id;
    let offer = await OfferModule.getById(offerId);
    if (!offer) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? " Offer not found" : " العرض غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    offer.isDeleted = true;
    offer = await offer.save();
    return res.status(200).send({
      isSuccessed: true,
      data: offer,
      error: null,
    });
  },
};

export { OfferController };
