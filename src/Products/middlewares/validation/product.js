import boom from "@hapi/boom";
import { ProductValidations } from "../../utils/validations/product";
import { BazarModule } from "../../../ProviderManagement/modules/bazar";

const ProductValidationWares = {
  async addProduct(req, res, next) {
    let lang = req.headers.lang || "ar",
      auth = req.headers.authentication,
      errMsg =
        lang == "en"
          ? "Please select keyImage to upload!"
          : "صورة المنتج مطلوبة";

    if (!req.files["productCover"]) {
      return next(boom.badData(errMsg));
    }

    let { error } = ProductValidations.addProduct.validate(req.body);
    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    let bazar = await BazarModule.getById(req.body.bazar);
    if (!bazar) return next(boom.badData(error.details[0].message));

    if (bazar.type === "COUPONS_PROVIDER") {
      errMsg =
        lang == "en"
          ? "Bazar Type must be COUPON_PROVIDER"
          : " يجب ان يكون محل او أسر منتجة";
      return next(boom.badData(errMsg));
    }

    if (bazar.isBazarAccepted === false) {
      errMsg =
        lang == "en"
          ? "Bazar must be Activated before"
          : "يجب تفعيل الحساب اولا";
      return next(boom.badData(errMsg));
    }
    next();
  },

  async updateProduct(req, res, next) {
    if (!req.body.nameAr) delete req.body.nameAr;
    if (!req.body.nameEn) delete req.body.nameEn;
    if (!req.body.descriptionAr) delete req.body.descriptionAr;
    if (!req.body.descriptionEn) delete req.body.descriptionEn;
    if (!req.body.price) delete req.body.price;
    if (!req.body.productCover) delete req.body.productCover;
    if (!req.body.productImages) delete req.body.productImages;
    if (!req.body.deleteImg) delete req.body.deleteImg;

    if (req.body.deleteImg && typeof req.body.deleteImg === "string") {
      let deleteImgArr = [];
      deleteImgArr.push(req.body.deleteImg);
      req.body.deleteImg = deleteImgArr;
    }

    if (req.body === {}) return next(boom.badData(error.details[0].message));
    let body = Object.create(req.body);
    delete body.bazar;
    const { error } = ProductValidations.updateProduct.validate(body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }
    next();
  },
};
export { ProductValidationWares };
