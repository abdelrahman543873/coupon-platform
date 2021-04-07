import { CategoryModel } from "./models/category.model.js";

export const getCategories = async (offset = 0, limit = 15) => {
  return await CategoryModel.paginate(
    {
      isDeleted: false,
    },
    { offset: offset * 10, limit, sort: "-createdAt", lean: true }
  );
};

export const getCategoryByName = async (enName, arName) => {
  return await CategoryModel.find({
    $or: [{ enName }, { arName }],
  });
};

export const createCategoryRepository = async (category) => {
  return await CategoryModel.create({
    ...category,
    ...(category.logoURL && { logoURL: category.logoURL.path }),
  });
};

export const rawDeleteCategory = async () => {
  return await CategoryModel.deleteMany({});
};
