function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
import { SubscripionModel } from "../models/subscription.js";
let subscriptionModule = {
  async subscripe(subscripe) {
    console.log(subscripe);
    return await SubscripionModel(_objectSpread({}, subscripe)).save().then(doc => {
      return {
        doc,
        err: null
      };
    }).catch(err => {
      console.log(err);
      return {
        doc: null,
        err
      };
    });
  },

  async getUserSubscripe(user, coupon) {
    if (!checkAllMongooseId(user)) return null;
    if (!checkAllMongooseId(coupon)) return null;
    return await SubscripionModel.findOne({
      user,
      coupon,
      isUsed: false,
      note: ""
    });
  },

  async getSubscriptions(user, provider, isPaid, isConfirmed, note, skip = null, limit = null) {
    if (!checkAllMongooseId(user)) return null;
    if (!checkAllMongooseId(provider)) return null;
    let queryOp = {};
    user ? queryOp.user = user : "";
    provider ? queryOp.provider = provider : "";
    isPaid ? queryOp.isPaid = true : "";
    isConfirmed == false || isConfirmed == true ? queryOp.isConfirmed = isConfirmed : "";
    note ? queryOp.note = "" : ""; // isUsed ? (queryOp.isUsed = isUsed) : "";
    // isPaid ? (queryOp.isPaid = isPaid) : "";

    return await SubscripionModel.find(_objectSpread({}, queryOp)).sort("-createdAt").skip(skip).limit(limit);
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await SubscripionModel.findById(id);
  },

  async scan(user, provider) {
    if (!checkAllMongooseId(user)) return [];
    if (!checkAllMongooseId(provider)) return [];
    return await SubscripionModel.find({
      user,
      provider,
      isUsed: false
    });
  },

  async delete(ids) {
    //if (!checkAllMongooseId(ids)) return null;
    return await SubscripionModel.deleteMany({
      _id: {
        $in: ids
      }
    }).then(doc => ({
      doc,
      err: null
    })).catch(err => ({
      err,
      doc: null
    }));
  }

};
export { subscriptionModule };