import { AdsModule } from "../../modules/ads";
import { BazarModule } from "../../modules/bazar";
import { ProviderModule } from "../../modules/provider";
import { AdsPackagesModule } from "../../../Admin&PlatformSpec/modules/adsPackages";

const AdsController = {
  async add(req, res, next) {
    let { bazarId, descriptionAr, descriptionEn, pakageId } = req.body,
      adURL = "";

    if (req.file) {
      adURL =
        "http://api.bazar.alefsoftware.com/api/v1/providers-management/bazars/bazars-ads/" +
        req.file.filename;
    }
    let bazar = await BazarModule.getById(bazarId);

    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar not found" : " المحل غير صحيح";
      return next(boom.unauthorized(errMsg));
    }
    let packages =await AdsPackagesModule.getById(pakageId);
    if (!packages) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Package not found" : " الحزمة غير موجودة";
      return next(boom.unauthorized(errMsg));
    }
    let isPaid = false;
    if (packages.price === 0) isPaid = true;
    console.log(packages)
    let advertisement = await AdsModule.add(
      bazarId,
      descriptionAr,
      descriptionEn,
      pakageId,
      isPaid,
      adURL
    );

    return res.status(201).send({
      isSuccessed: true,
      data: advertisement,
      error: null,
    });
  },

  async getBazarAds(req, res, next) {
    let providerId = req.params.id,
      provider = await ProviderModule.getById(providerId);

    if (!provider) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Bazar not found" : "صاحب المتجر غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    console.log(provider.bazar._id);
    let advertisement = await AdsModule.getAds(
      null,
      null,
      null,
      provider.bazar._id
    );
    console.log(advertisement);
    return res.status(201).send({
      isSuccessed: true,
      data: advertisement,
      error: null,
    });
  },
};

export { AdsController };
