import { CategoryModel } from "./models/category.model.js";
import dotenv from "dotenv";

dotenv.config();
export const getCategories = async (offset = 0, limit = 15) => {
  return await CategoryModel.paginate(
    {},
    { offset: offset * limit, limit, sort: "-createdAt" }
  );
};

export const getCategoryByName = async (enName, arName) => {
  return await CategoryModel.find({
    $or: [{ enName }, { arName }],
  });
};

export const findCategoryRepository = async (_id) => {
  return await CategoryModel.findOne({ _id });
};

export const createCategoryRepository = async (category) => {
  return await CategoryModel.create({
    ...category,
    ...(category.unselected && {
      unSelected: process.env.SERVER_IP + category.unselected.path,
    }),
    ...(category.selected && {
      selected: process.env.SERVER_IP + category.selected.path,
    }),
  });
};

export const updateCategoryRepository = async ({ _id, category }) => {
  return await CategoryModel.findOneAndUpdate(
    { _id },
    {
      ...category,
      ...(category.unselected && {
        unSelected: process.env.SERVER_IP + category.unselected.path,
      }),
      ...(category.selected && {
        selected: process.env.SERVER_IP + category.selected.path,
      }),
    },
    {
      new: true,
      lean: true,
    }
  );
};

export const rawDeleteCategory = async () => {
  return await CategoryModel.deleteMany({});
};

export const deleteCategory = async (_id) => {
  return await CategoryModel.findOneAndDelete({ _id }, { lean: true });
};
