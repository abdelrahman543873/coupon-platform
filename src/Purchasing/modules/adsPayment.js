import { AdsPayModel } from "../models/adsPayment";

let AdsPayModule = {
  async add(ad) {
    return await AdsPayModel({ ...ad })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err,
        };
      });
  },
  async getById(id) {
    return await AdsPayModel.findById(id);
  },
};
export { AdsPayModule };
