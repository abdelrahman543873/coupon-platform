import { BazarModel } from "../models/bazar";
import { AdsModule } from "./ads";
import { ProductModule } from "../../Products/modules/product";
import { PeymentTypeModel } from "../../Admin&PlatformSpec/models/paymentType";
import { BankModel } from "../models/bankAccount";
import { CreditModel } from "../models/criditCard";
import { OrderModel } from "../../Purchasing/models/order";
import mongoose, { set } from "mongoose";
import { ProductModel } from "../../Products/models/product";
import { CouponModule } from "../../Products/modules/coupon";
import { CouponPayModule } from "../../Purchasing/modules/couponPayment";

const ObjectId = mongoose.Types.ObjectId;

const BazarModule = {
  async getById(id) {
    return await BazarModel.findById(id);
  },

  async add(bazar) {
    return await BazarModel({
      ...bazar,
    })
      .save()
      .then(async (doc) => {
        doc = await doc.populate("paymentType").execPopulate();
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
  async getBazarByProvider(provider) {
    return await BazarModel.findOne({ provider }).catch((err) => {
      console.log(err);
      return null;
    });
  },

  async getProvidersById(ids, projection) {
    return await BazarModel.find({ _id: { $in: ids } }, projection)
      .lean()
      .catch((err) => {
        console.log(err);
        return null;
      });
  },

  async getBazars(
    type = "",
    populateProvider = false,
    countItems = false,
    wAds = false
  ) {
    let VIBazars = [],
      ads = [],
      queryOp = {},
      providerPath = "";
    queryOp.isBazarAccepted = true;
    if (type !== "") {
      queryOp.type = type;
    }

    if (populateProvider === "true") {
      providerPath = "provider";
    }
    if (wAds) {
      ads = await AdsModule.getAds(null, true, true, null, true);

      if (populateProvider === "true") {
        ads.map(async (ad) => {
          return await ad.populate("bazar.provider").execPopulate();
        });
      }
      VIBazars = ads.map((ad) => ad.bazar._id);
      queryOp._id = {
        $nin: VIBazars,
      };
    }

    let bazars = await BazarModel.find({
      ...queryOp,
    })
      .lean()
      .populate({ path: providerPath })
      .populate("paymentType")
      .then(async (bazars) => {
        bazars.map((bazar) => {
          delete bazar.provider.password;
        });
        if (countItems === "true") {
          for (let i = 0; i < bazars.length; i++) {
            bazars[i].itemsCount = await ProductModule.getStoreProductsCount(
              bazars[i]._id
            );
          }
          return bazars;
        } else return bazars;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
    return {
      bazars,
      advertisements: ads,
    };
  },

  async searchBazars(skip, limit, name) {
    return await BazarModel.find({
      name: new RegExp(name, "i"),
      isBazarAccepted: true,
    })
      .skip(skip)
      .limit(limit)
      .catch((err) => {
        console.log(err);
        return [];
      });
  },
  async adminBazarsQuery(isBazarAccepted = "", type = null, limit, skip) {
    let queryOp = {};
    if (
      typeof isBazarAccepted == "boolean" ||
      isBazarAccepted == "true" ||
      isBazarAccepted == "false"
    ) {
      queryOp.isBazarAccepted = isBazarAccepted;
    }
    if (type) {
      queryOp.type = type;
    }
    return await BazarModel.find({
      ...queryOp,
    })
      .skip(skip)
      .limit(limit)
      .populate("provider")
      .populate("cityId")
      .populate("resources")
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async bazarVerification(id, isAccepted) {
    let bazar = await this.getById(id);
    bazar.isBazarAccepted = isAccepted;
    return await bazar.save();
  },
  async updateResources(id, resourceId) {
    return await BazarModel.updateOne(
      { _id: id },
      {
        $push: { resources: resourceId },
      }
    ).catch((err) => {
      console.log(err);
      return [];
    });
  },

  async editBazarInfo(id, bazarData) {
    return await BazarModel.findByIdAndUpdate(
      id,
      { $set: { ...bazarData } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },

  async getAvailblePayment() {
    return await PeymentTypeModel.find({ isActive: true });
  },

  async addBankAccount(bank) {
    return await BankModel({ ...bank })
      .save()
      .then((doc) => {
        return {
          bank: doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          bank: null,
          err: err,
        };
      });
  },

  async addCreditCard(card) {
    return await CreditModel({ ...card })
      .save()
      .then((doc) => {
        return {
          card: doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          card: null,
          err: err,
        };
      });
  },

  async editPaymentWay(id, paymentTypes) {
    return await BazarModel.findByIdAndUpdate(
      id,
      { $set: { paymentType: paymentTypes } },
      { new: true }
    )
      .then((doc) => {
        return {
          data: doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          data: null,
          err: err,
        };
      });
  },

  async toggleBankAccount(id, bankId, state) {
    let bank = await BankModel.findByIdAndUpdate(
      bankId,
      { $set: { isActive: state } },
      { new: true }
    );

    if (!bank)
      return {
        data: null,
        err: err,
      };
    let bazar = await BazarModel.findById(id);
    if (state && !bazar.bankAccount.includes(bankId))
      bazar.bankAccount.push(bankId);
    else if (!state && bazar.bankAccount.includes(bankId))
      bazar.bankAccount.pop(bankId);

    return await bazar
      .save()
      .then(async (doc) => {
        return {
          data: await doc.populate("bankAccount").execPopulate(),
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          data: null,
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

  async getOrderStatistics(bazar) {
    let orders = await OrderModel.aggregate([
      { $match: { bazar: ObjectId(bazar) } },
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: null,
          counts: {
            $push: {
              k: "$_id",
              v: "$count",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$counts" },
        },
      },
    ]).then((res) => {
      if (res != []) return res[0];
    });

    let products = await OrderModel.aggregate([
      { $unwind: "$products" },
      {
        $match: {
          bazar: ObjectId(bazar),
          state: { $in: ["ACCEPTED", "SHIPPED TO USER ADDRESS", "DELIVERED"] },
        },
      },
      {
        $group: {
          _id: "$products.product",
        },
      },
      // {
      //   $lookup: {
      //     from: "products",
      //     localField: "_id",
      //     foreignField: "_id",
      //     as: "_id",
      //   },
      // },
    ]).then((res) => {
      if (res != []) return res;
    });
    let totalProducts = await ProductModel.countDocuments({ bazar: bazar });
    for (let i = 0; i < products.length; i++) {
      products[i] = await ProductModule.getById(products[i]._id);
    }
    console.log(products);
    //console.log(orders);
    return {
      orders,
      orderedProducts: products,
      totalProducts,
    };
  },

  async getCouponStatistics(bazar) {
    let totalCoupons = await CouponModule.getCouponByProvider(bazar, false);
    let totalConsumed = await CouponPayModule.getConsumedCoupons(
      null,
      bazar,
      null,
      null,
      null,
      null
    );
    let consumedArray = [];

    for (let i = 0; i < totalConsumed.length; i++) {
      consumedArray.push(totalConsumed[i].couponId);
    }
    console.log(consumedArray);

    consumedArray = Array.from(new Set(consumedArray));
    console.log(consumedArray);
    return {
      totalOrders: totalConsumed.length,
      totalCoupons: totalCoupons.length,
      consumedCoupons: consumedArray,
    };
  },
  async getFcmTokens(bazarId,role) {
    let bazar = await BazarModel.findById(bazarId)
      .populate("provider", "fcmToken")
      .populate("resources", "fcmToken roles");
    let tokensArray = [];
    if (bazar.provider.fcmToken != "")
      tokensArray.push(bazar.provider.fcmToken);
    for (let i = 0; i < bazar.resources.length; i++) {
      if (
        bazar.resources[i].fcmToken != "" &&
        (bazar.resources[i].roles.includes(role) ||
          bazar.resources[i].roles.includes(role))
      )
        tokensArray.push(bazar.resources[i].fcmToken);
    }
    return tokensArray;
  },
};

export { BazarModule };
