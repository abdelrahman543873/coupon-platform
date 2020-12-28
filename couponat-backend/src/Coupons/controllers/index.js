import boom from "@hapi/boom";
import { getErrorMessage } from "../../utils/handleDBError";
import { CouponModule } from "../modules/coupon";
import { nanoid } from "nanoid";
import { Coupon, Subscription } from "../../middlewares/responsHandler";
import { decodeToken } from "../../utils/JWTHelper";
import Jimp from "jimp";
import { ClientModule } from "../../Users/modules/client";
import { subscriptionModule } from "../../Purchasing/modules/subscription";
import { ProviderModule } from "../../Users/modules/provider";
import { NotificationModule } from "../../CloudMessaging/module/notification";
import { SubscripionModel } from "../../Purchasing/models/subscription";
import { CouponModel } from "../models/coupon";

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
    let provider = await ProviderModule.getById(auth.id);
    if (!provider) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? " provider not found" : "مقدم الخدمة غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    if (provider && !provider.isActive) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }
    coupon.provider = auth.id;
    coupon.code = nanoid(6);
    // let fileName = coupon.code + Date.now() + ".png";
    // let qrURL = QRCode.toFile("./Coupons-Images/" + fileName, coupon.code, {
    //   color: {
    //     dark: "#575757", // Blue dots
    //     light: "#0000", // Transparent background
    //   },
    // });
    // coupon.qrURL = "/coupons-management/coupons-images/" + fileName;

    if (req.file) {
      console.log("1111");
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("assets/images/logo.png")
          .then((logoTpl) => {
            logoTpl.opacity(0.4);
            let logoH = tpl.bitmap.height * 0.15;
            let logoW = tpl.bitmap.width * 0.15;
            let diffHight = parseInt((tpl.bitmap.height - logoH) / 2),
              diffWidth = parseInt((tpl.bitmap.width - logoW) / 2);
            console.log(logoTpl.bitmap.height);
            return tpl.composite(
              logoTpl.resize(logoW, logoH),
              tpl.bitmap.width - logoW - diffWidth,
              tpl.bitmap.height - logoH - diffHight,
              [Jimp.BLEND_DESTINATION_OVER]
            );
          })
          .then((tpl) => {
            return tpl.write("Coupons-Images/" + req.file.filename);
          });
      });
      // .catch(err=>{

      // });
      console.log("1321");
      imgURL = "/coupons-management/coupons-images/" + req.file.filename;
      coupon.imgURL = imgURL;
    }

    let savedCoupon = await CouponModule.add(coupon);
    if (savedCoupon.err)
      return next(
        boom.badData(getErrorMessage(savedCoupon.err, req.headers.lang || "ar"))
      );
    savedCoupon = new Coupon(savedCoupon.doc);
    await NotificationModule.newCouponNotification(
      savedCoupon.id,
      req.headers.lang,
      savedCoupon.provider.name
    );
    return res.status(201).send({
      isSuccessed: true,
      data: savedCoupon,
      error: null,
    });
  },

  async search(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth ? auth.id : null;
    let name = req.query.name,
      skip = parseInt(req.query.skip) || 0,
      limit = parseInt(req.query.limit) || 0;

    let coupons = await CouponModule.search(skip, limit, name);
    coupons = coupons.map((coupon) => {
      return new Coupon(coupon);
    });

    let user = await ClientModule.getById(id);
    ///console.log(user.favCoupons);
    if (user && user.favCoupons) {
      coupons = await addFavProp(coupons, user.favCoupons);
    } else coupons = await addFavProp(coupons, null);
    for (let i = 0; i < coupons.length; i++) {
      let sub = user
        ? await subscriptionModule.getUserSubscripe(user.id, coupons[i].id)
        : null;
      coupons[i].isSubscribe = sub ? true : false;
    }
    let dataCounter = await CouponModel.countDocuments({
      isActive: true,
      totalCount: { $gt: 0 },
      $or: [
        { "name.english": new RegExp(name, "i") },
        { "name.arabic": new RegExp(name, "i") },
      ],
    });
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      dataCounter,
      error: null,
    });
  },

  async updateCoupon(req, res, next) {
    let id = req.params.id;
    let auth = await decodeToken(req.headers.authentication),
      imgURL = "";
    if (auth.type != "PROVIDER" && auth.type != "ADMIN") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    if (auth.type == "PROVIDER") {
      let provider = await ProviderModule.getById(auth.id);
      if (!provider.isActive) {
        let lang = req.headers.lang || "ar",
          errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
        return next(boom.unauthorized(errMsg));
      }
    }

    let coupons = await CouponModule.getById(id);
    console.log(coupons);
    console.log(coupons ? true : false);
    if (!coupons) {
      let errMsg =
        req.headers.lang == "en" ? "Coupon not found" : "كوبون الخصم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let body = req.body;
    body.name && !body.name.arabic
      ? (body.name.arabic = coupons.name.arabic)
      : "";

    body.name && !body.name.english
      ? (body.name.english = coupons.name.english)
      : "";

    body.description && !body.description.arabic
      ? (body.description.arabic = coupons.description.arabic)
      : "";

    body.description && !body.description.english
      ? (body.description.english = coupons.description.english)
      : "";
    if (req.file) {
      let diffHight = 0,
        diffWidth = 0;
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("assets/images/logo.png")
          .then((logoTpl) => {
            logoTpl.opacity(0.4);
            let logoH = tpl.bitmap.height * 0.15;
            let logoW = tpl.bitmap.width * 0.15;
            let diffHight = parseInt((tpl.bitmap.height - logoH) / 2),
              diffWidth = parseInt((tpl.bitmap.width - logoW) / 2);
            console.log(logoTpl.bitmap.height);
            return tpl.composite(
              logoTpl.resize(logoW, logoH),
              tpl.bitmap.width - logoW - diffWidth,
              tpl.bitmap.height - logoH - diffHight,
              [Jimp.BLEND_DESTINATION_OVER]
            );
          })
          .then((tpl) => {
            return tpl.write("Coupons-Images/" + req.file.filename);
          });
      });
      imgURL = "/coupons-management/coupons-images/" + req.file.filename;
      body.imgURL = imgURL;
    }
    let updateCoupon = await CouponModule.updateCoupon(id, body);
    if (updateCoupon.err)
      return next(
        boom.badData(
          getErrorMessage(updateCoupon.err, req.headers.lang || "ar")
        )
      );
    updateCoupon = new Coupon(updateCoupon.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: updateCoupon,
      error: null,
    });
  },

  async deleteCoupon(req, res, next) {
    let id = req.params.id;
    let auth = await decodeToken(req.headers.authentication);
    console.log(auth);
    if (auth.type != "PROVIDER" && auth.type != "ADMIN") {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    let doc = await CouponModule.getById(id);
    if (!doc) {
      let errMsg =
        req.headers.lang == "en" ? "Coupon not found" : "كوبون الخصم غير موجود";
      return next(boom.notFound(errMsg));
    }

    let subscriptions = await SubscripionModel.find({ coupon: id });
    if (subscriptions.length > 0) {
      let errMsg =
        req.headers.lang == "en"
          ? "Can't delete coupon"
          : "لا يمكن مسح هذا الكوبون";
      return next(boom.notFound(errMsg));
    }

    let delet = await CouponModule.delete(id);
    if (delet.err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    console.log("doc: ", doc);
    return res.status(200).send({
      isSuccessed: true,
      data: delet.doc,
      error: null,
    });
  },

  async getAll(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth ? auth.id : null;
    console.log(id);
    let category = req.query.category || null,
      limit = parseInt(req.query.limit) || null,
      skip = parseInt(req.query.skip) || null,
      section = req.query.section || null,
      provider = req.query.provider || null;
    let coupons = await CouponModule.getAll(
      skip,
      limit,
      category,
      provider,
      section
    );
    if (coupons.err) {
      return next(boom.unauthorized(coupons.err));
    }
    coupons = coupons.map((coupon) => {
      return new Coupon(coupon);
    });
    let user = await ClientModule.getById(id);
    if (user && user.favCoupons) {
      coupons = await addFavProp(coupons, user.favCoupons);
    } else coupons = await addFavProp(coupons, null);
    for (let i = 0; i < coupons.length; i++) {
      let sub = user
        ? await subscriptionModule.getUserSubscripe(user.id, coupons[i].id)
        : null;
      coupons[i].isSubscribe = sub ? true : false;
    }
    let dataCounter = await CouponModel.countDocuments({
      totalCount: { $gt: 0 },
      isActive: true,
    });
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      dataCounter,
      error: null,
    });
  },

  async getById(req, res, next) {
    let couponId = req.params.id;
    let auth = await decodeToken(req.headers.authentication),
      id = auth ? auth.id : null;

    let coupon = await CouponModule.getById(couponId);
    console.log({
      couponId,
      coupon,
    });
    if (!coupon) {
      let errMsg =
        req.headers.lang == "en" ? "Coupon not found" : "كوبون الخصم غير موجود";
      return next(boom.notFound(errMsg));
    }

    coupon = new Coupon(coupon);
    let user = await ClientModule.getById(id);
    if (user && user.favCoupons) {
      coupon = await addFavProp([coupon], user.favCoupons);
    } else coupon = await addFavProp([coupon], null);
    coupon = coupon[0];
    let sub = user
      ? await subscriptionModule.getUserSubscripe(user.id, coupon.id)
      : null;
    coupon.isSubscribe = sub ? true : false;

    return res.status(200).send({
      isSuccessed: true,
      data: coupon,
      error: null,
    });
  },
};

async function addFavProp(coupons, userFav) {
  if (!userFav) {
    return coupons.map((coupon) => {
      return Object.assign(coupon, {
        isFav: false,
      });
    });
  }
  return coupons.map((coupon) => {
    return Object.assign(coupon, {
      isFav: userFav.some((item) => {
        console.log(coupon.id, "---", item);
        console.log(item == coupon.id);
        return item + "" == coupon.id + "";
      }),
    });
  });
}

// async function addSubProp(coupons, id) {
//   for (let i = 0; i < coupons.length; i++) {
//     // coupons[i] = coupons[i].toObject();
//     coupons[i].isSubscribe = (await subscriptionModule.getUserSubscripe(
//       id,
//       coupons[i].id
//     ))
//       ? true
//       : false;
//   }
// }
export { CouponController };
