import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { getCategories } from "./category.repository.js";

export const getCategoriesService = async (req, res, next) => {
  try {
    const categories = await getCategories(req.query.offset, req.query.limit);
    if (!categories) throw new BaseHttpError(624);
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
