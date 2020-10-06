import boom from "@hapi/boom";
import { BazarModule } from "../../ProviderManagement/modules/bazar";
import { AdsPayModule } from "../modules/adsPayment";
import { AdsModule } from "../../ProviderManagement/modules/ads";
let AdsPayController = {
  async add(req, res, next) {
    let adsPayment = req.body;
    let bazarId = req.params.bazar;

    let ad = await AdsModule.getById(adsPayment.adId);
    if (!ad) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Ad not found!" : "الاعلان غير موجود";
      return next(boom.badData(errMsg));
    }

    let bazar = await BazarModule.getById(bazarId);
    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "bazar not found!" : "المتجر غير موجود";
      return next(boom.badData(errMsg));
    }

    // if (adsPayment.accountId) {
    //   let account =
    //     (await BankModel.findById(couponPayment.accountId)) ||
    //     (await CreditModel.findById(couponPayment.accountId));
    //   if (!account) {
    //     let lang = req.headers.lang || "ar",
    //       errMsg = lang == "en" ? "account not found!" : "الحساب غير موجود";
    //     return next(boom.badData(errMsg));
    //   }
    // }
    adsPayment.bazar = bazarId;
    if (req.file) {
      let imgURL =
        "http://api.bazar.alefsoftware.com/api/v1/admins/payments/adsPayments-images/" +
        req.file.filename;
      adsPayment.imgURL = imgURL;
    }
    let { doc, err } = await AdsPayModule.add(adsPayment);

    if (err) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    }

    if (adsPayment.paymentType && adsPayment.paymentType == "ONLINE_PAYMENT") {
      ad.isPaid = true;
    }
    ad.paymentId = doc._id;
    ad = await ad.save();
    return res.status(200).send({
      isSuccessed: true,
      data: doc,
      error: null,
    });
  },
};

export { AdsPayController };
