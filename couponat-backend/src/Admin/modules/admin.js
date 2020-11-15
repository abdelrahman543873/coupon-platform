import { AdminModel } from "../models/admin";
import { ProviderModel } from "../../Users/models/provider";
import { CouponModel } from "../../Coupons/models/coupon";
import { AppCreditModel } from "../../Purchasing/models/appCridit";
const AdminModule = {
  async add(email, name, password) {
    return await AdminModel({
      email,
      name,
      password,
    })
      .save()
      .then((doc) => {
        return {
          user: doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          user: null,
          err: err,
        };
      });
  },

  async getByEmail(email) {
    return await AdminModel.findOne({ email }).catch((err) => {
      console.log(err);
      return null;
    });
  },

  async getStatistics() {
    let selectionDate = new Date(new Date().setDate(new Date().getDate() - 10));
    let providers = await ProviderModel.countDocuments({ isActive: true });
    let coupons = await CouponModel.countDocuments({ totalCount: { $gt: 0 } });
    let newProviders = await ProviderModel.countDocuments({
      createdAt: { $gte: selectionDate },
    });
    let newCoupons = await CouponModel.countDocuments({
      createdAt: { $gte: selectionDate },
    });

    return {
      providers,
      newProviders,
      coupons,
      newCoupons,
    };
  },
};

export { AdminModule };
