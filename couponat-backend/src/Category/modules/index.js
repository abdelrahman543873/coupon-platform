import { CategoryModel } from "../models/index";
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
    return await CategoryModel.findById(id);
  },
  async getAll() {
    return await CategoryModel.find().sort("-createdAt");
  },

  async update(id, newData) {
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
};

export { CategoryModule };
