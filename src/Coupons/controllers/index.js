import boom from "@hapi/boom";
import { getErrorMessage } from "../../utils/handleDBError";
import { CouponModule } from "../modules/coupon";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { IP } from "../../../serverIP";
import { Coupon } from "../../middlewares/responsHandler";
import { decodeToken } from "../../utils/JWTHelper";

const CouponController = {
  async addCoupon(req, res, next) {
    let coupon = req.body;
    let auth = await decodeToken(req.headers.authentication),
      imgURL = "";
    console.log(auth);
    if (auth.type != "PROVIDER" && auth.type != "ADMIN") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }
    coupon.provider = auth.id;
    coupon.code = nanoid(6);
    let fileName = coupon.code + Date.now() + ".png";
    let qrURL = QRCode.toFile("./Coupons-Images/" + fileName, coupon.code);
    coupon.qrURL = IP + "/coupons-management/coupons-images/" + fileName;

    if (req.file) {
      imgURL = IP + "/coupons-management/coupons-images/" + req.file.filename;
      coupon.imgURL = imgURL;
    }

    let savedCoupon = await CouponModule.add(coupon);
    if (savedCoupon.err)
      return next(
        boom.badData(getErrorMessage(savedCoupon.err, req.headers.lang || "ar"))
      );
    savedCoupon = new Coupon(savedCoupon.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: savedCoupon,
      error: null,
    });
  },

  // async getCouponsProviders(req, res, next) {
  //   let providers = await CouponModule.getCouponsProviders(),
  //     auth = req.headers.authentication,
  //     favs = [];
  //   if (auth) {
  //     let decodeAuth = await decodeTokenAndGetType(auth);
  //     if (decodeAuth && decodeAuth.type == "CUSTOMER") {
  //       favs = ClientModule.getFavCoupons(decodeAuth.id);
  //     }
  //   }
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: providers.map((provider) => {
  //       return Object.assign(provider, {
  //         coupons: addFavProp(provider.coupons, favs),
  //       });
  //     }),
  //     error: null,
  //   });
  // },

  // async getCouponsByPovider(req, res, next) {
  //   let provider = req.params.id;
  //   let coupons = await CouponModule.getCouponByProvider(provider);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: coupons,
  //     error: null,
  //   });
  // },

  // async updateCoupon(req, res, next) {
  //   let id = req.query.couponId;
  //   let newData = req.body;

  //   let bazarId = req.body.bazar,
  //     bazar = await BazarModule.getById(bazarId),
  //     providerId = bazar.provider,
  //     provider = await ProviderModule.getById(providerId),
  //     coupon = await CouponModule.getById(id);

  //   if (!coupon || coupon.bazar + "" !== bazarId) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "coupon not found" : "الكوبون غير موجود";
  //     return next(boom.unauthorized(errMsg));
  //   }
  //   if (
  //     !provider.roles.includes("BAZAR_CREATOR") &&
  //     !provider.roles.includes("BAZAR_PRODUCTS_EDITOR")
  //   ) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
  //     return next(boom.unauthorized(errMsg));
  //   }

  //   if (req.file) {
  //     let keyImageURL =
  //       "http://api.bazar.alefsoftware.com/api/v1/products/coupons/coupons-images/" +
  //       req.file.filename;
  //     newData.keyImageURL = keyImageURL;
  //   }

  //   delete newData.bazar;
  //   let update = await CouponModule.updateCoupon(id, newData);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: update,
  //     error: null,
  //   });
  // },

  // async deleteCoupon(req, res, next) {
  //   let id = req.query.couponId;
  //   let newData = req.body;

  //   let bazarId = req.body.bazar,
  //     bazar = await BazarModule.getById(bazarId),
  //     providerId = bazar.provider,
  //     provider = await ProviderModule.getById(providerId),
  //     coupon = await CouponModule.getById(id);

  //   if (!coupon || coupon.bazar + "" !== bazarId) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "coupon not found" : "الكوبون غير موجود";
  //     return next(boom.unauthorized(errMsg));
  //   }
  //   if (
  //     !provider.roles.includes("BAZAR_CREATOR") &&
  //     !provider.roles.includes("BAZAR_PRODUCTS_EDITOR")
  //   ) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
  //     return next(boom.unauthorized(errMsg));
  //   }

  //   let deleteCoupon = await CouponModule.deleteCoupon(id);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: deleteCoupon,
  //     error: null,
  //   });
  // },
};

// function addFavProp(coupons, userFav) {
//   return coupons.map((coupon) => {
//     return Object.assign(coupon, {
//       isFav: userFav.some((item) => item._id + "" === coupon._id + ""),
//     });
//   });
// }
export { CouponController };
