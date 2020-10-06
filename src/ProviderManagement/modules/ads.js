import { AdsModel } from "../models/ads";

const AdsModule = {
  async getById(id) {
    return await AdsModel.findById(id).populate('pakageId').populate('paymentId').populate('bazar','name').catch((err) => {
      console.log(err);
      return null;
    });
  },
  async getAds(date, isPaid, isAccepted, bazar, bazarPop) {
    let queryOp = {};
    let bazarPath = "";
    if (date) {
      queryOp.startDate = {
        $gte: date,
      };
      queryOp.endDate = {
        $lte: date,
      };
    }
    if (bazarPop) bazarPath = "bazar";
    if (bazar) {
      queryOp.bazar = bazar;
    }
    if (isPaid) {
      queryOp.isPaid = isPaid;
    }
    if (isAccepted) {
      queryOp.isAccepted = isAccepted;
    }
    return await AdsModel.find({
      ...queryOp,
    })
      .populate({ path: bazarPath })
      .populate("pakageId")
      .sort("-createdAt")
      .catch((err) => {
        console.log(err);
        return [];
      });
  },
  async add(bazar, descriptionAr, descriptionEn, pakageId, isPaid, adURL) {
    return await AdsModel({
      bazar,
      descriptionAr,
      descriptionEn,
      pakageId,
      isPaid,
      adURL,
    })
      .save()
      .catch((err) => {
        console.log(err);
        return null;
      });
  },
};

export { AdsModule };
