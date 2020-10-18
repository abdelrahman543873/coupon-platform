import { AdsPackagesModel } from "../models/adsPackages";
import { query } from "express";

let AdsPackagesModule = {
  async addPackage(packages) {
    return await AdsPackagesModel({ ...packages }).save();
  },
  async getPackages(isActive) {
    let queryOp = {};
    if (isActive) queryOp.isActive = isActive;
    return await AdsPackagesModel.find({ ...queryOp });
  },
  async getById(id) {
    return await AdsPackagesModel.findById(id);
  },
};
export { AdsPackagesModule };
