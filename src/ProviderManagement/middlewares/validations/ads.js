import boom from "@hapi/boom";
import { AdsValidations } from "../../utils/validations/ads";
import { getVideoDurationInSeconds } from "get-video-duration";
import fs from "fs";

const AdsValidationWares = {
  async addAds(req, res, next) {
    let maxDuration;
    let lang = req.headers.lang || "ar",
      errMsg =
        lang == "en"
          ? "Please select Ads to upload!"
          : "برجاء اختيار صورة او فيديو للاعلان";
    let { error } = AdsValidations.add.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    if (!req.file) {
      return next(boom.badData(errMsg));
    } else {
      maxDuration = await getVideoDurationInSeconds(
        "Bazars-Ads/" + req.file.filename
      )
        .then(async (duration) => {
          return await duration;
        })
        .catch((err) => {});
    }
    if (maxDuration && maxDuration > 30.0) {
      fs.unlinkSync("Bazars-Ads/" + req.file.filename);
      errMsg =
        lang == "en"
          ? "Vedio duration must be less than 30 sec!"
          : "طول الفيديو لا يزيد عن 30 ثانية";
      return next(boom.badData(errMsg));
    }
    next();
  },
};

export { AdsValidationWares };
