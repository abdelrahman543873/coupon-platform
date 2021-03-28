import boom from "@hapi/boom";
import { CategoryValidations } from "../../utils/validations/index.js";
const CategoryalidationWares = {
  async add(req, res, next) {
    console.log("req: ", req.files);
    let name = {
      arabic: req.body.arabic,
      english: req.body.english
    };
    delete req.body.arabic;
    delete req.body.english;
    req.body.name = name;
    let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Please Images to upload!" : "صور التصنيف مطلوبة";
    console.log(JSON.stringify(req.body));
    let {
      error
    } = CategoryValidations.add.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    if (!req.files || !req.files["selectedImage"] || !req.files["unselectedImage"]) {
      return next(boom.badData(errMsg));
    }

    next();
  },

  async update(req, res, next) {
    console.log("Hereeee");
    let name = {
      arabic: req.body.arabic || null,
      english: req.body.english || null
    };
    req.body.english || req.body.arabic ? req.body.name = name : "";
    req.body.arabic ? delete req.body.arabic : "";
    req.body.english ? delete req.body.english : "";
    console.log(req.body);
    let {
      error
    } = CategoryValidations.edit.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  }

};
export { CategoryalidationWares };