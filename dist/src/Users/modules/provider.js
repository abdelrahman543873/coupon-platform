function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { CouponModel } from "../../Coupons/models/coupon.js";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
import { ProviderModel } from "../models/provider.js";
const ProviderModule = {
  async add(provider) {
    return await ProviderModel(_objectSpread({}, provider)).save().then(doc => {
      return {
        doc,
        err: null
      };
    }).catch(err => {
      return {
        doc: null,
        err
      };
    });
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await ProviderModel.findById(id);
  },

  async getByEmail(email) {
    return await ProviderModel.findOne({
      email
    });
  },

  async getByCode(code) {
    return await ProviderModel.findOne({
      code
    });
  },

  async getAll(isAdmin, limit = null, skip = null, id = null, qr = null) {
    if (id && !checkAllMongooseId(id)) return [];
    let queryOp = {};
    if (id) queryOp._id = id;
    if (qr) queryOp.qrURL = {
      $exists: true,
      $ne: ""
    };
    !isAdmin ? queryOp.isActive = true : "";
    return ProviderModel.find(_objectSpread({}, queryOp)).sort("-createdAt").limit(limit).skip(skip);
  },

  async search(skip = 1, limit = 1, name = "") {
    let queryOp = {};

    if (name !== "") {
      queryOp.name = new RegExp(name, "i");
    }

    return await ProviderModel.find(_objectSpread({}, queryOp)).skip(skip).limit(limit).catch(err => {
      console.log(err);
      return [];
    });
  },

  async updateProvider(id, providerData) {
    if (!checkAllMongooseId(id)) return null;
    console.log(providerData);
    return await ProviderModel.findByIdAndUpdate(id, {
      $set: _objectSpread({}, providerData)
    }, {
      new: true
    }).then(doc => {
      console.log(doc);
      return {
        doc,
        err: null
      };
    }).catch(err => {
      return {
        doc: null,
        err
      };
    });
  },

  async changePassword(id, newPassword) {
    if (!checkAllMongooseId(id)) return null;
    return await ProviderModel.findByIdAndUpdate(id, {
      $set: {
        password: newPassword
      }
    }, {
      new: true
    }).then(doc => {
      return {
        doc: doc,
        err: null
      };
    }).catch(err => {
      return {
        doc: null,
        err: err
      };
    });
  },

  async delete(id) {
    if (!checkAllMongooseId(id)) return null;
    return await ProviderModel.deleteOne({
      _id: id
    }).then(doc => ({
      doc,
      err: null
    })).catch(err => ({
      err,
      doc: null
    }));
  },

  async getStatistics(id) {
    console.log(id);
    let totalCoupons = await CouponModel.aggregate([{
      $match: {
        provider: id
      }
    }, {
      $group: {
        _id: null,
        totalCoupons: {
          $sum: {
            $sum: ["$totalCount", "$subCount"]
          }
        }
      }
    }]);
    let residualCoupons = await CouponModel.aggregate([{
      $match: {
        provider: id
      }
    }, {
      $group: {
        _id: null,
        residualCoupons: {
          $sum: "$totalCount"
        }
      }
    }, {
      $project: {
        residualCoupons: "$residualCoupons"
      }
    }]);
    let totalSubscriptions = await CouponModel.aggregate([{
      $match: {
        provider: id
      }
    }, {
      $group: {
        _id: null,
        totalSubscriptions: {
          $sum: "$subCount"
        }
      }
    }, {
      $project: {
        totalSubscriptions: "$totalSubscriptions"
      }
    }]);
    totalCoupons = totalCoupons.length > 0 ? totalCoupons[0].totalCoupons : 0;
    residualCoupons = residualCoupons.length > 0 ? residualCoupons[0].residualCoupons : 0;
    totalSubscriptions = totalSubscriptions.length > 0 ? totalSubscriptions[0].totalSubscriptions : 0;
    console.log(totalCoupons);
    console.log(totalSubscriptions);
    console.log(residualCoupons);
    return {
      totalCoupons: totalCoupons,
      totalSubscriptions: totalSubscriptions,
      residualCoupons: residualCoupons
    };
  },

  async emailVerification(email) {
    let provider = await this.getByEmail(email);
    if (provider) return false;else return true;
  }

};
export { ProviderModule };