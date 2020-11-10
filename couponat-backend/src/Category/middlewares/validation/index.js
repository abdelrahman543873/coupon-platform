import boom from "@hapi/boom";
import { CategoryValidations } from "../../utils/validations";

const CategoryalidationWares = {
  async add(req, res, next) {
    console.log("req: ", req.files);
    //console.log("req2: ", req);
    let lang = req.headers.lang || "ar",
      errMsg = lang == "en" ? "Please Images to upload!" : "صور التصنيف مطلوبة";
    console.log(req.body);
    let { error } = CategoryValidations.add.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    if (
      !req.files ||
      !req.files["selectedImage"] ||
      !req.files["unselectedImage"]
    ) {
      return next(boom.badData(errMsg));
    }
    next();
  },

  async update(req, res, next) {
    console.log("Hereeee");

    let { error } = CategoryValidations.edit.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { CategoryalidationWares };
