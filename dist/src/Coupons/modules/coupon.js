function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
import { CouponModel } from "../models/coupon.js";
const CouponModule = {
  async add(coupon) {
    return await CouponModel(_objectSpread({}, coupon)).save().then(doc => {
      return {
        doc,
        err: null
      };
    }).catch(err => {
      return {
        doc: null,
        err: err
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
      $gte: 1
    };
    if (category) queryOp.category = category;
    if (provider) queryOp.provider = provider;
    console.log(queryOp);

    if (section) {
      if (section == "newest") sort = "-createdAt";else if (section == "bestSeller") {
        queryOp.subCount = {
          $gt: 0
        };
        sort = "-subCount";
      } else {
        return {
          err: "Section Must be newest or bestSeller"
        };
      }
    }

    if (sold && sold == "false") queryOp.totalCount = {
      $gt: 0
    };
    if (sold && sold == "true") queryOp.totalCount = 0;
    return await CouponModel.find(_objectSpread({}, queryOp)).sort(sort).skip(skip).limit(limit).catch(err => {
      return {
        err
      };
    });
  },

  async search(skip = 1, limit = 1, name = "", category) {
    if (category && !checkAllMongooseId(category)) return [];
    let queryOp = {};
    category ? queryOp.category = category : "";
    queryOp.isActive = true;

    if (name !== "") {
      queryOp.$or = [{
        "name.english": new RegExp(name, "i")
      }, {
        "name.arabic": new RegExp(name, "i")
      }, {
        "description.english": new RegExp(name, "i")
      }, {
        "description.arabic": new RegExp(name, "i")
      }];
    }

    queryOp.totalCount = {
      $gte: 1
    };
    return await CouponModel.find(_objectSpread({}, queryOp)).skip(skip).limit(limit).catch(err => {
      console.log(err);
      return [];
    });
  },

  async updateCoupon(id, couponData) {
    if (!checkAllMongooseId(id)) return null;
    return await CouponModel.findByIdAndUpdate(id, {
      $set: _objectSpread({}, couponData)
    }, {
      new: true
    }).then(doc => {
      return {
        doc,
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
    return await CouponModel.deleteOne({
      _id: id
    }).then(doc => ({
      doc,
      err: null
    })).catch(err => ({
      err,
      doc: null
    }));
  }

};
export { CouponModule };