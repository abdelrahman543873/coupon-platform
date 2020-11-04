import { CategoryModel } from "../models/index";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
const CategoryModule = {
  async add(category) {
    return await CategoryModel({
      ...category,
    })
      .save()
      .then((doc) => {
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
  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    console.log("here", checkAllMongooseId(id));
    return await CategoryModel.findById(id);
  },
  async getAll() {
    let categories = await CategoryModel.find().sort("-createdAt");
    let all = {
      name: {
        arabic: "الكل",
        english: "All",
      },
      images: {
        selected: "/categories-management/categories-images/selected.png",
        unSelected: "/categories-management/categories-images/unselected.png",
      },
    };
    let newCategories = [all].concat(categories);
    return newCategories;
  },

  async update(id, newData) {
    if (!(await checkAllMongooseId(id))) return null;
    console.log("here", checkAllMongooseId(id));
    return await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { ...newData } },
      { new: true }
    )
      .then((doc) => {
        return {
          doc: doc,
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

  async delete(id) {
    if (!checkAllMongooseId(id)) return null;
    return await CategoryModel.deleteOne({ _id: id })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { CategoryModule };
