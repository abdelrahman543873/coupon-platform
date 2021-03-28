function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { AdminModel } from "../models/admin.js";
import { ProviderModel } from "../../Users/models/provider.js";
import { CouponModel } from "../../Coupons/models/coupon.js";
import { SubscripionModel } from "../../Purchasing/models/subscription.js";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
import { ContactModel } from "../../Users/models/contactUs.js";
const AdminModule = {
  async add(email, name, password) {
    return await AdminModel({
      email,
      name,
      password
    }).save().then(doc => {
      return {
        user: doc,
        err: null
      };
    }).catch(err => {
      console.log(err);
      return {
        user: null,
        err: err
      };
    });
  },

  async update(id, newData) {
    return await AdminModel.findByIdAndUpdate(id, _objectSpread({}, newData), {
      new: true
    }).then(doc => {
      return {
        doc,
        err: null
      };
    }).catch(err => {
      console.log(err);
      return {
        doc: null,
        err: err
      };
    });
  },

  async getByEmail(email) {
    return await AdminModel.findOne({
      email
    }).catch(err => {
      console.log(err);
      return null;
    });
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await AdminModel.findById(id).catch(err => {
      return null;
    });
  },

  async getStatistics() {
    let selectionDate = new Date(new Date().setDate(new Date().getDate() - 10));
    let providers = await ProviderModel.countDocuments();
    let coupons = await CouponModel.countDocuments({
      totalCount: {
        $gt: 0
      },
      isActive: true
    });
    let newProviders = await ProviderModel.countDocuments({
      createdAt: {
        $gte: selectionDate
      }
    });
    let newCoupons = await CouponModel.countDocuments({
      createdAt: {
        $gte: selectionDate
      }
    });
    let subscriptions = await SubscripionModel.countDocuments({
      note: ""
    });
    let newSubscriptions = await SubscripionModel.countDocuments({
      createdAt: {
        $gte: selectionDate
      },
      note: ""
    });
    return {
      providers,
      newProviders,
      coupons,
      newCoupons,
      subscriptions,
      newSubscriptions
    };
  },

  async deleteMail(mailId) {
    if (!checkAllMongooseId(mailId)) return null;
    return await ContactModel.deleteOne({
      _id: mailId
    }).then(doc => ({
      doc,
      err: null
    })).catch(err => ({
      err,
      doc: null
    }));
  }

};
export { AdminModule };