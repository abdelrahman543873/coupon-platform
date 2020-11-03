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
    return await CouponModel.findById(id)
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

  async getAll(skip, limit, category, provider, section) {
    let queryOp = {},
      sort = "";
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
    queryOp.isDeleted = false;
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
    return await CouponModel.findOne({ code });
  },

  async delete(id) {
    return await CouponModel.deleteOne({ _id: id })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { CouponModule };
