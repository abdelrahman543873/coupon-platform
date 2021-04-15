import faker from "faker";
import { CategoryModel } from "./models/category.model.js";

export const buildCategoryParams = (obj = {}) => {
  return {
    enName: obj.enName || faker.commerce.productName(),
    arName: obj.arName || faker.commerce.productName(),
    selected: obj.selected || faker.internet.url(),
    unSelected: obj.unSelected || faker.internet.url(),
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
