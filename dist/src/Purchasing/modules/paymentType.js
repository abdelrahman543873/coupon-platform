function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
import { PeymentTypeModel } from "../models/paymentType.js";
let paymentTypeModule = {
  async add(payment) {
    return await PeymentTypeModel(_objectSpread({}, payment)).save().then(doc => {
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

  async switchPayment(id) {
    if (!checkAllMongooseId(id)) return null;
    let payment = await PeymentTypeModel.findById(id);
    payment.isActive = !payment.isActive;
    payment = await payment.save();
    return payment;
  },

  async getAll(isAdmin = null) {
    let queryOp = {};
    queryOp.isActive = true;
    isAdmin == "true" || isAdmin == true ? delete queryOp.isActive : "";
    return await PeymentTypeModel.find(_objectSpread({}, queryOp));
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await PeymentTypeModel.findById(id);
  }

};
export { paymentTypeModule };