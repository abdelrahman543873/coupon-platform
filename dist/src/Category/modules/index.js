function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { CategoryModel } from "../models/index.js";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";
const CategoryModule = {
  async add(category) {
    return await CategoryModel(_objectSpread({}, category)).save().then(doc => {
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
    console.log("here", checkAllMongooseId(id));
    return await CategoryModel.findById(id);
  },

  async getAll(type = "") {
    let categories = await CategoryModel.find().sort("-createdAt");
    let all = {
      name: {
        arabic: "الكل",
        english: "All"
      },
      images: {
        selected: "/categories-management/categories-images/selected.png",
        unSelected: "/categories-management/categories-images/unselected.png"
      }
    }; //let newCategories = [];

    if (type == "CLIENT") return [all].concat(categories);
    return categories;
  },

  async update(id, newData) {
    if (!checkAllMongooseId(id)) return null;
    console.log("here", newData);
    return await CategoryModel.findByIdAndUpdate(id, {
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

  async delete(id) {
    if (!checkAllMongooseId(id)) return null;
    return await CategoryModel.deleteOne({
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
export { CategoryModule };