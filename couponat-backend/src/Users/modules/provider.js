import { CouponModel } from "../../Coupons/models/coupon";
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

  async getAll() {
    return ProviderModel.find({ isActive: true }).sort("-createdAt");
  },

  async updateProvider(id, providerData) {
    if (!checkAllMongooseId(id)) return null;

    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { ...providerData } },
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
    let totalCoupons = CouponModel.aggregate([
      {
        $match: { provider: id },
      },
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: $totalCount },
        },
      },
    ]);

    console.log(totalCoupons);
    return await totalCoupons;
  },
};

export { ProviderModule };
