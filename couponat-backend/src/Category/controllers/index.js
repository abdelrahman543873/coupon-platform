import boom from "@hapi/boom";
import { IP } from "../../../serverIP";
import { Category } from "../../middlewares/responsHandler";
import { getErrorMessage } from "../../utils/handleDBError";
import { CategoryModel } from "../models";
import { CategoryModule } from "../modules";

const CategoryController = {
  async addCategory(req, res, next) {
    let category = req.body;
    let selected = "";
    let unSelected = "";

    if (req.files) {
      selected =
        "/categories-management/categories-images/" +
        req.files["selectedImage"][0].filename;
      unSelected =
        "/categories-management/categories-images/" +
        req.files["unselectedImage"][0].filename;
      category.images = { selected, unSelected };
    }

    let savedCategory = await CategoryModule.add(category);
    if (savedCategory.err)
      return next(
        boom.badData(
          getErrorMessage(savedCategory.err, req.headers.lang || "ar")
        )
      );

    savedCategory = new Category(savedCategory.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: savedCategory,
      error: null,
    });
  },

  async getAll(req, res, next) {
    let categories = await CategoryModule.getAll();
    categories = categories.map((category) => {
      return new Category(category);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: categories,
      error: null,
    });
  },

  async updateCategory(req, res, next) {
    console.log("Hereeee");
    let id = req.params.id;
    let { name } = req.body;
    let selected = null;
    let unSelected = null;

    let category = await CategoryModule.getById(id);

    if (!category) {
      let errMsg = lang == "en" ? "Category not found" : "التصنيف غير موجود";
      return next(boom.notFound(errMsg));
    }

    category = category.toObject();

    if (req.files) {
      req.files["selectedImage"]
        ? (selected =
            "/categories-management/categories-images/" +
            req.files["selectedImage"][0].filename)
        : "";

      req.files["unselectedImage"]
        ? (unSelected =
            "/categories-management/categories-images/" +
            req.files["unselectedImage"][0].filename)
        : "";
      category.images = {
        selected: selected || category.images.selected,
        unSelected: unSelected || category.images.unSelected,
      };
    }

    name && name.arabic ? (category.name.arabic = name.arabic) : "";
    name && name.english ? (category.name.english = name.english) : "";
    let updateCategory = await CategoryModule.update(id, category);
    if (updateCategory.err)
      return next(
        boom.badData(
          getErrorMessage(updateCategory.err, req.headers.lang || "ar")
        )
      );

    updateCategory = new Category(updateCategory.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: updateCategory,
      error: null,
    });
  },
};
export { CategoryController };
