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
    return await CouponModel.findById(id);
  },

  async getAll(skip, limit, category, provider, section) {
    let queryOp = {};
    queryOp.isDeleted = false;
    if (category) queryOp.category = category;
    if (provider) queryOp.provider = provider;
    console.log(queryOp);
    return await CouponModel.find({ ...queryOp })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  },

  // async getCouponByProvider(bazar, isDeleted = false) {
  //   return await CouponModel.find({ bazar, isDeleted }).catch((err) => {
  //     console.log(err);
  //     return null;
  //   });
  // },

  // async getCouponsProviders() {
  //   let coupons = await CouponModel.aggregate([
  //     {
  //       $match: { isDeleted: false },
  //     },
  //     {
  //       $group: {
  //         _id: "$bazar",
  //         coupons: { $push: "$_id" },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "bazars",
  //         localField: "_id",
  //         foreignField: "_id",
  //         as: "_id",
  //       },
  //     },

  //     {
  //       $lookup: {
  //         from: "coupons",
  //         localField: "coupons",
  //         foreignField: "_id",
  //         as: "coupons",
  //       },
  //     },

  //     { $unwind: "$_id" },
  //       {
  //         $replaceRoot: {
  //           newRoot: { $mergeObjects: [{ bazar: "$_id", coupons: "$coupons" }] },
  //         },
  //       },
  //     {
  //       $addFields: {
  //         "bazar.coupons": "$coupons",
  //       },
  //     },
  //       {
  //       $project: {
  //         bazar: 1,
  //       },
  //     },
  //     { $replaceRoot: { newRoot: "$bazar" }},
  //     {
  //       $lookup: {
  //         from: "banks",
  //         localField: "bankAccount",
  //         foreignField: "_id",
  //         as: "bankAccount",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "credits",
  //         localField: "creditCard",
  //         foreignField: "_id",
  //         as: "creditCard",
  //       },
  //     },
  //   ]);

  //   for (let i = 0; i < coupons.length; i++) {
  //     console.log(coupons[i])
  //     coupons[i].creditCard = coupons[i].creditCard[0];
  //   }
  //   coupons.sort(this.compare);
  //   //console.log(coupons);
  //   return coupons;
  // },

  // async updateCoupon(id, couponData) {
  //   return await CouponModel.findByIdAndUpdate(
  //     id,
  //     { $set: { ...couponData } },
  //     { new: true }
  //   ).catch((err) => {
  //     console.log(err);
  //     return { err: err };
  //   });
  // },

  // async deleteCoupon(id) {
  //   return await CouponModel.findByIdAndUpdate(
  //     id,
  //     {
  //       $set: { isDeleted: true },
  //     },
  //     { new: true }
  //   ).catch((err) => {
  //     console.log(err);
  //     return { err: err };
  //   });
  // },

  // compare(a, b) {
  //   return a.createdAt - b.createdAt;
  // },
};

export { CouponModule };
