import { CouponModel } from "../../Coupons/models/coupon";
import { SubscripionModel } from "../../Purchasing/models/subscription";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
import { ProviderModel } from "../models/provider";

const ProviderModule = {
  async add(provider) {
    return await ProviderModel({ ...provider })
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
    if (!checkAllMongooseId(id)) return null;

    return await ProviderModel.findById(id);
  },

  async getByEmail(email) {
    return await ProviderModel.findOne({ email });
  },

  async getAll(isAdmin) {
    let queryOp = {};
    !isAdmin ? (queryOp.isActive = true) : "";
    return ProviderModel.find({ ...queryOp }).sort("-createdAt");
  },

  async updateProvider(id, providerData) {
    if (!checkAllMongooseId(id)) return null;
    console.log(providerData);
    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { ...providerData } },
      { new: true }
    )
      .then((doc) => {
        console.log(doc);
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

  async changePassword(id, newPassword) {
    if (!checkAllMongooseId(id)) return null;

    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { password: newPassword } },
      { new: true }
    )
      .then((doc) => {
        return {
          doc: doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err: err,
        };
      });
  },

  async delete(id) {
    if (!checkAllMongooseId(id)) return null;

    return await ProviderModel.deleteOne({ _id: id })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },

  async getStatistics(id) {
    console.log(id);
    let totalCoupons = await CouponModel.aggregate([
      {
        $match: { provider: id },
      },
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: { $sum: ["$totalCount", "$subCount"] } },
        },
      },
    ]);

    let residualCoupons = await CouponModel.aggregate([
      {
        $match: { provider: id },
      },
      {
        $group: {
          _id: null,
          residualCoupons: { $sum: "$totalCount" },
        },
      },
      {
        $project: {
          residualCoupons: "$residualCoupons",
        },
      },
    ]);

    let totalSubscriptions = await SubscripionModel.countDocuments({
      provider: id,
    });

    // totalCoupons = totalCoupons.length > 0 ? totalCoupons[0].totalCoupons : 0;
    // residualCoupons =
    //   residualCoupons > 0 ? residualCoupons[0].residualCoupons : 0;
    console.log(totalCoupons);
    console.log(totalSubscriptions);
    console.log(residualCoupons);
    return {
      totalCoupons: totalCoupons,
      totalSubscriptions,
      residualCoupons: residualCoupons,
    };
  },

  async emailVerification(email) {
    let provider = await this.getByEmail(email);
    if (provider) return false;
    else return true;
  },
};

export { ProviderModule };
