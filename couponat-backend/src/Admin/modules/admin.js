import { AdminModel } from "../models/admin";
import { ProviderModel } from "../../Users/models/provider";
import { CouponModel } from "../../Coupons/models/coupon";
import { AppCreditModel } from "../../Purchasing/models/appCridit";
import { SubscripionModel } from "../../Purchasing/models/subscription";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
import { ContactModel } from "../../Users/models/contactUs";
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

  async update(id, newData) {
    return await AdminModel.findByIdAndUpdate(id, { ...newData }, { new: true })
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          doc: null,
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

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;

    return await AdminModel.findById(id).catch((err) => {
      console.log(err);
      return null;
    });
  },

  async getStatistics() {
    let selectionDate = new Date(new Date().setDate(new Date().getDate() - 10));
    let providers = await ProviderModel.countDocuments();
    let coupons = await CouponModel.countDocuments({ totalCount: { $gt: 0 } });
    let newProviders = await ProviderModel.countDocuments({
      createdAt: { $gte: selectionDate },
    });
    let newCoupons = await CouponModel.countDocuments({
      createdAt: { $gte: selectionDate },
    });
    let subscriptions = await SubscripionModel.countDocuments({
      note: "",
    });
    let newSubscriptions = await SubscripionModel.countDocuments({
      createdAt: { $gte: selectionDate },
      note: "",
    });
    return {
      providers,
      newProviders,
      coupons,
      newCoupons,
      subscriptions,
      newSubscriptions,
    };
  },

  async deleteMail(mailId) {
    if (!checkAllMongooseId(mailId)) return null;

    return await ContactModel.deleteOne({ _id: mailId })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { AdminModule };
