import { AdminModel } from "../models/admin";
import { ProviderModel } from "../../Users/models/provider";
import { CouponModel } from "../../Coupons/models/coupon";
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

  // async getCategoryStatistics() {
  //   let coupons = await CouponModel.aggregate([
  //     {
  //       $lookup: {
  //         from: "categories",
  //         localField: "category",
  //         foreignField: "_id",
  //         as: "category",
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$category.name.english",
  //         count: { $sum: 1 },
  //       },
  //     },
  //     { $sort: { _id: 1 } },
  //     {
  //       $group: {
  //         _id: null,
  //         counts: {
  //           $push: {
  //             k: "$_id",
  //             v: "$count",
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $replaceRoot: {
  //         newRoot: { $arrayToObject: "$counts" },
  //       },
  //     },
  //   ]);
  //   return {
  //     coupons,
  //   };
  // },

  // async getStatistics() {
  //   let bazars = await BazarModel.aggregate([
  //     {
  //       $group: {
  //         _id: "$type",
  //         count: { $sum: 1 },
  //       },
  //     },
  //     { $sort: { _id: 1 } },
  //     {
  //       $group: {
  //         _id: null,
  //         counts: {
  //           $push: {
  //             k: "$_id",
  //             v: "$count",
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $replaceRoot: {
  //         newRoot: { $arrayToObject: "$counts" },
  //       },
  //     },
  //   ]).then((res) => {
  //     if (res != []) return res[0];
  //   });

  //   let clients = await ClientModel.countDocuments();
  //   return {
  //     bazars,
  //     clients,
  //   };
  // },

  // async getAllClients() {
  //   return await ClientModel.find().populate("favProducts");
  // },

  // async addPaymentWay(payment) {
  //   console.log(payment);
  //   return await PeymentTypeModel({ ...payment })
  //     .save()
  //     .then((doc) => {
  //       return {
  //         payment: doc,
  //         err: null,
  //       };
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return {
  //         payment: null,
  //         err: err,
  //       };
  //     });
  // },

  // async getAvailPayment(isAd) {
  //   console.log(isAd);
  //   if (isAd && isAd == "true")
  //     return await PeymentTypeModel.find({ key: { $ne: "COD" } });
  //   return await PeymentTypeModel.find();
  // },

  // async switchPayment(id) {
  //   let payment = await PeymentTypeModel.findById(id);
  //   payment.isActive = !payment.isActive;
  //   payment=await payment.save();
  //   return payment
  // },

  // async addBankAccount(bank) {
  //   return await AppBankModel({ ...bank })
  //     .save()
  //     .then((doc) => {
  //       return {
  //         bank: doc,
  //         err: null,
  //       };
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return {
  //         bank: null,
  //         err: err,
  //       };
  //     });
  // },

  // async getBanks(isActive) {
  //   let queryOp = {};
  //   if (isActive) queryOp.isActive = true;
  //   return await AppBankModel.find({ ...queryOp });
  // },

  // async deleteAllPayment() {
  //   return await PeymentTypeModel.deleteMany({});
  // },
};

export { AdminModule };
