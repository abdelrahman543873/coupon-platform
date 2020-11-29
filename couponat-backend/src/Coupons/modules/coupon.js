import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
import { CouponModel } from "../models/coupon";

const CouponModule = {
  async add(coupon) {
    return await CouponModel({
      ...coupon,
    })
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
          err: err,
        };
      });
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await CouponModel.findById(id);
  },

  async getAll(skip, limit, category, provider, section, sold = null) {
    if (!checkAllMongooseId(category)) return null;
    if (!checkAllMongooseId(provider)) return null;

    let queryOp = {},
      sort = "-createdAt";

    queryOp.isActive = true;
    queryOp.totalCount = {
      $gte: 1,
    };
    if (category) queryOp.category = category;
    if (provider) queryOp.provider = provider;
    console.log(queryOp);
    if (section) {
      if (section == "newest") sort = "-createdAt";
      else if (section == "bestSeller") sort = "-subCount";
      else {
        return { err: "Section Must be newest or bestSeller" };
      }
    }
    if (sold && sold == "false") queryOp.totalCount = { $gt: 0 };
    if (sold && sold == "true") queryOp.totalCount = 0;
    return await CouponModel.find({ ...queryOp })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .catch((err) => {
        return { err };
      });
  },

  async search(skip = 1, limit = 1, name = "") {
    let queryOp = {};
    queryOp.isActive = true;
    if (name !== "") {
      queryOp.$or = [
        {
          "name.english": new RegExp(name, "i"),
        },
        {
          "name.arabic": new RegExp(name, "i"),
        },
      ];
    }
    queryOp.totalCount = {
      $gte: 1,
    };
    return await CouponModel.find({
      ...queryOp,
    })
      .skip(skip)
      .limit(limit)
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async updateCoupon(id, couponData) {
    if (!checkAllMongooseId(id)) return null;

    return await CouponModel.findByIdAndUpdate(
      id,
      { $set: { ...couponData } },
      { new: true }
    )
      .then((doc) => {
        return {
          doc,
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

  async scan(code) {
    return await CouponModel.findOne({ code, isActive: true });
  },

  async delete(id) {
    if (!checkAllMongooseId(id)) return null;

    return await CouponModel.deleteOne({ _id: id })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { CouponModule };
