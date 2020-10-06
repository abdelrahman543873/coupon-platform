import { OfferModel } from "../models/offers";

const OfferModule = {
  async getById(id) {
    return await OfferModel.findById(id);
  },

  async add(
    discount,
    descAr,
    descEn,
    type,
    bazar,
    product,
    startDate,
    endDate,
    imgURL
  ) {
    return await OfferModel({
      discount,
      descAr,
      descEn,
      type,
      bazar,
      product,
      startDate,
      endDate,
      imgURL,
    })
      .save()
      .then((doc) => {
        return { doc };
      })
      .catch((err) => {
        return { err };
      });
  },

  async getByBazar(bazar) {
    return await OfferModel.find({
      isDeleted: false,
      bazar: bazar,
      endDate: { $gte: new Date() },
    })
      .populate("bazar")
      .populate("product");
  },

  async getOffers() {
    return await OfferModel.find({
      isDeleted: false,
      endDate: { $gte: new Date() },
    })
      .populate("bazar")
      .populate("product");
  },
};

export { OfferModule };
