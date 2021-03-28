import boom from "@hapi/boom";
import { Category } from "../../middlewares/responsHandler.js";
import { getErrorMessage } from "../../utils/handleDBError.js";
import { CategoryModule } from "../modules/index.js";
const CategoryController = {
  async addCategory(req, res, next) {
    let category = req.body;
    let selected = "";
    let unSelected = "";

    if (req.files) {
      selected = "/categories-management/categories-images/" + req.files["selectedImage"][0].filename;
      unSelected = "/categories-management/categories-images/" + req.files["unselectedImage"][0].filename;
      category.images = {
        selected,
        unSelected
      };
    }

    let savedCategory = await CategoryModule.add(category);
    if (savedCategory.err) return next(boom.badData(getErrorMessage(savedCategory.err, req.headers.lang || "ar")));
    savedCategory = new Category(savedCategory.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: savedCategory,
      error: null
    });
  },

  async getAll(req, res, next) {
    let categories = await CategoryModule.getAll();
    categories = categories.map(category => {
      return new Category(category);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: categories,
      error: null
    });
  }

};
export { CategoryController };