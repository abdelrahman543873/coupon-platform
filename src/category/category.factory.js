import faker from "faker";
import { CategoryModel } from "./models/category.model.js";

export const buildCategoryParams = (obj = {}) => {
  return {
    name: {
      arabic: obj.arabicName || faker.commerce.productName(),
      english: obj.englishName || faker.commerce.productName(),
    },
    isDeleted: obj.isDeleted || false,
    images: {
      selected: faker.internet.url(),
      unselected: faker.internet.url(),
    },
  };
};

export const categoriesFactory = async (count = 10, obj = {}) => {
  const categories = [];
  for (let i = 0; i < count; i++) {
    categories.push(buildCategoryParams(obj));
  }
  return await CategoryModel.collection.insertMany(categories);
};

export const categoryFactory = async (obj = {}) => {
  const params = buildCategoryParams(obj);
  return await CategoryModel.create(params);
};
