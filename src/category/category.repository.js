import { CategoryModel } from "./models/category.model.js";

export const getCategories = async (offset = 0, limit = 15) => {
  return await CategoryModel.paginate(
    {
      isActive: true,
    },
    { offset: offset * 10, limit, sort: "-createdAt", lean: true }
  );
};
