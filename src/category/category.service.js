import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  createCategoryRepository,
  findCategoryRepository,
  getCategories,
  getCategoryByName,
  updateCategoryRepository,
} from "./category.repository.js";
import { home } from "./home.enum.js";
export const getCategoriesService = async (req, res, next) => {
  try {
    const categories = await getCategories(req.query.offset, req.query.limit);
    // home category returned only in the first element of the first offset
    if (!req.query.offset || req.query.offset == 0)
      categories.docs.unshift(home);
    if (!categories) throw new BaseHttpError(624);
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const addCategoryService = async (req, res, next) => {
  try {
    if (!req.files || !req.files.selected || !req.files.unSelected)
      throw new BaseHttpError(637);
    const category = await getCategoryByName(req.body.enName, req.body.arName);
    if (!!category.length) throw new BaseHttpError(626);
    const createdCategory = await createCategoryRepository({
      ...req.body,
      selected: req.files.selected[0],
      unselected: req.files.unSelected[0],
    });
    res.status(200).json({
      success: true,
      data: createdCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryService = async (req, res, next) => {
  try {
    const category = await findCategoryRepository(req.body.category);
    if (!category) throw new BaseHttpError(627);
    const updatedCategory = await updateCategoryRepository({
      _id: category.id,
      category: {
        ...req.body,
        selected: req.files?.selected?.[0],
        unselected: req.files?.unSelected?.[0],
      },
    });
    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
