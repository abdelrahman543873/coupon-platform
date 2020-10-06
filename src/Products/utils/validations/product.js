import Joi from "@hapi/joi";
import { errorsOverride } from "../../../utils/JoiErrorOverriding";
import { checkMongooseId } from "../../../utils/mongooseIdHelper";

const ProductValidations = {
  addProduct: Joi.object({
    bazar: Joi.string().required().error(errorsOverride),
    nameAr: Joi.string().min(3).max(30).required().error(errorsOverride),
    nameEn: Joi.string().min(3).max(30).required().error(errorsOverride),
    descriptionAr: Joi.string().min(10).required().error(errorsOverride),
    descriptionEn: Joi.string().min(10).required().error(errorsOverride),
    price: Joi.number().required().positive().error(errorsOverride),
  }),
  updateProduct: Joi.object({
    nameAr: Joi.string().min(3).max(30).optional().error(errorsOverride),
    nameEn: Joi.string().min(3).max(30).optional().error(errorsOverride),
    descriptionAr: Joi.string().min(10).optional().error(errorsOverride),
    descriptionEn: Joi.string().min(10).optional().error(errorsOverride),
    price: Joi.number().optional().positive().error(errorsOverride),
    deleteImg: Joi.array().items(Joi.string().optional().error(errorsOverride)),
  }),
};

export { ProductValidations };
