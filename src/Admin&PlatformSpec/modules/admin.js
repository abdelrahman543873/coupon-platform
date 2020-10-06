import { AdminModel } from "../models/admin";
import { BazarModel } from "../../ProviderManagement/models/bazar";
import { ClientModel } from "../../CustomersManagement/models/client";
import { PeymentTypeModel } from "../models/paymentType";
import { AppBankModel } from "../models/appBanks";

const AdminModule = {
  async add(email, username, password, role) {
    return await AdminModel({
      email,
      username,
      password,
      role,
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
    let bazars = await BazarModel.aggregate([
      {
        $group: {
          _id: "$type",
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

    let clients = await ClientModel.countDocuments();
    return {
      bazars,
      clients,
    };
  },

  async getAllClients() {
    return await ClientModel.find().populate("favProducts");
  },

  async addPaymentWay(payment) {
    console.log(payment);
    return await PeymentTypeModel({ ...payment })
      .save()
      .then((doc) => {
        return {
          payment: doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          payment: null,
          err: err,
        };
      });
  },

  async getAvailPayment(isAd) {
    console.log(isAd)
    if (isAd && isAd == "true")
      return await PeymentTypeModel.find({ key: { $ne: "COD" } });
    return await PeymentTypeModel.find();
  },

  async deletePayment(id) {
    return await PeymentTypeModel.findByIdAndUpdate(
      id,
      {
        $set: { isActive: false },
      },
      { new: true }
    );
  },

  async addBankAccount(bank) {
    return await AppBankModel({ ...bank })
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

  async getBanks(isActive) {
    let queryOp = {};
    if (isActive) queryOp.isActive = true;
    return await AppBankModel.find({ ...queryOp });
  },

  async deleteAllPayment() {
    return await PeymentTypeModel.deleteMany({});
  },
};

export { AdminModule };
