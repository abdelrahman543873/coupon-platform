function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { CityModel } from "../models/city.js";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
const CityModule = {
  async getAll(isAdmin) {
    let queryOp = {};
    if (!isAdmin) queryOp.isActive = true;
    return await CityModel.find(_objectSpread({}, queryOp)).lean().then(async cities => {
      return cities;
    });
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await CityModel.findById(id);
  },

  async addCity(name, location) {
    return await CityModel({
      name,
      location
    }).save().then(docs => {
      return {
        docs,
        err: null
      };
    }).catch(err => {
      return {
        docs: null,
        err
      };
    });
  },

  async update(id, newData) {
    if (!checkAllMongooseId(id)) return null;
    return await CityModel.findByIdAndUpdate(id, {
      $set: _objectSpread({}, newData)
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

  async switchCity(id) {
    if (!checkAllMongooseId(id)) return null;
    let city = await CityModel.findById(id);
    if (!city) return null;
    city.isActive = !city.isActive;
    city = await city.save();
    return city;
  }

};
export { CityModule };