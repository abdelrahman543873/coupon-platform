import boom from "@hapi/boom";
import { getErrorMessage } from "../../utils/handleDBError";
import { CouponModule } from "../modules/coupon";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { Coupon, Subscription } from "../../middlewares/responsHandler";
import { decodeToken } from "../../utils/JWTHelper";
import Jimp from "jimp";
import PDFDocument from "pdfkit";
import fs from "fs";
import { IP } from "../../../serverIP";
import { ClientModule } from "../../Users/modules/client";
import { subscriptionModule } from "../../Purchasing/modules/subscription";
import { ProviderModule } from "../../Users/modules/provider";
import { NotificationModule } from "../../CloudMessaging/module/notification";

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
    if (!provider.isActive) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }
    coupon.provider = auth.id;
    coupon.code = nanoid(6);
    let fileName = coupon.code + Date.now() + ".png";
    let qrURL = QRCode.toFile("./Coupons-Images/" + fileName, coupon.code, {
      color: {
        dark: "#00F", // Blue dots
        light: "#0000", // Transparent background
      },
    });
    coupon.qrURL = "/coupons-management/coupons-images/" + fileName;

    if (req.file) {
      let diffHight = 0,
        diffWidth = 0;
      console.log("1111");
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("assets/images/logo.png")
          .then((logoTpl) => {
            diffHight = parseInt(
              (tpl.bitmap.height - logoTpl.bitmap.height) / 2
            );
            diffWidth = parseInt((tpl.bitmap.width - logoTpl.bitmap.width) / 2);
            logoTpl.opacity(0.4);
            console.log(logoTpl.bitmap.height);
            return tpl.composite(
              logoTpl.resize(65, 65),
              tpl.bitmap.width - logoTpl.bitmap.width - diffWidth,
              tpl.bitmap.height - logoTpl.bitmap.height - diffHight,
              [Jimp.BLEND_DESTINATION_OVER]
            );
          })
          .then((tpl) => {
            return tpl.write("Coupons-Images/" + req.file.filename);
          });
      });
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
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  async updateCoupon(req, res, next) {
    let id = req.params.id;
    let auth = await decodeToken(req.headers.authentication),
      imgURL = "";
    if (
      auth != "Just for development" &&
      auth.type != "PROVIDER" &&
      auth.type != "ADMIN"
    ) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }
    let provider = await ProviderModule.getById(auth.id);
    if (!provider.isActive) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
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
      ? (body.name.arabic = coupon.name.arabic)
      : "";

    body.name && !body.name.english
      ? (body.name.english = coupon.name.english)
      : "";

    body.description && !body.description.arabic
      ? (body.description.arabic = coupon.description.arabic)
      : "";

    body.description && !body.description.english
      ? (body.description.english = coupon.description.english)
      : "";
    if (req.file) {
      let diffHight = 0,
        diffWidth = 0;
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("assets/images/logo.png")
          .then((logoTpl) => {
            diffHight = parseInt(
              (tpl.bitmap.height - logoTpl.bitmap.height) / 2
            );
            diffWidth = parseInt((tpl.bitmap.width - logoTpl.bitmap.width) / 2);
            logoTpl.opacity(0.4);
            console.log(logoTpl.bitmap.height);
            return tpl.composite(
              logoTpl.resize(65, 65),
              tpl.bitmap.width - logoTpl.bitmap.width - diffWidth,
              tpl.bitmap.height - logoTpl.bitmap.height - diffHight,
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
    if (
      auth != "Just for development" &&
      auth.type != "PROVIDER" &&
      auth.type != "ADMIN"
    ) {
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
    // console.log(user.favCoupons);
    if (user && user.favCoupons) {
      coupons = await addFavProp(coupons, user.favCoupons);
    } else coupons = await addFavProp(coupons, null);
    for (let i = 0; i < coupons.length; i++) {
      let sub = user
        ? await subscriptionModule.getUserSubscripe(user.id, coupons[i].id)
        : null;
      coupons[i].isSubscribe = sub ? true : false;
    }
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  async generatePDF(req, res, next) {
    let id = req.query.id || null;
    let coupons = await CouponModule.getAll(null, null, null, id, null);
    if (coupons.err) {
      return next(boom.unauthorized(coupons.err));
    }
    if (coupons.length < 1) {
      return res.status(200).send({
        isSuccessed: true,
        data: null,
        error:
          req.headers.lang == "en"
            ? "there is no coupons now"
            : "لا يوجود كوبونات خصم حاليا",
      });
    }

    coupons = coupons.map((coupon) => {
      return new Coupon(coupon);
    });

    let pdfDoc = new PDFDocument();
    let name = "AllCoupons.pdf";
    if (id) name = coupons[0].provider.name + ".pdf";
    name = name.trim();
    pdfDoc.pipe(fs.createWriteStream("./Coupons-Images/" + name));
    pdfDoc.moveDown(25);
    pdfDoc
      .fillColor("red")
      .font("./assets/fonts/Tajawal-Bold.ttf")
      .fontSize(50) // the text and the position where the it should come
      .text("Couponat El Madina", { align: "center" });

    coupons.map((coupon) => {
      pdfDoc.addPage();
      coupon.name.arabic = coupon.name.arabic.split(" ").reverse().join(" ");
      let segment_array = coupon.qrURL.split("/");
      let last_segment = segment_array.pop();
      pdfDoc
        .fillColor("blue")
        .font("./assets/fonts/Tajawal-Bold.ttf")
        .fontSize(20)
        .text("Provider: ", {
          continued: true,
        })
        .fillColor("black")
        .fontSize(20)
        .text(coupon.provider.name, { align: "left" });
      pdfDoc.moveDown(0.5);
      pdfDoc
        .fillColor("black")
        .fontSize(17)
        .text(coupon.name.english + " - ", { continued: true })
        .fillColor("black")
        .fontSize(17)
        .text(coupon.name.arabic);
      pdfDoc.moveDown(0.5);
      pdfDoc.image("./Coupons-Images/" + last_segment, {
        width: 300,
        height: 300,
        align: "cebnter",
      });
    });
    pdfDoc.end();
    return res.status(200).send({
      isSuccessed: true,
      data: IP + "/coupons-management/coupons-images/" + name,
      error: null,
    });
  },

  async scan(req, res, next) {
    let id = null;
    let subscription = null;
    let code = req.params.code;
    if (req.headers.authentication) {
      let auth = await decodeToken(req.headers.authentication);
      id = auth ? auth.id : null;
    }
    let coupon = await CouponModule.scan(code);
    if (!coupon) {
      return res.status(404).send({
        isSuccessed: false,
        data: null,
        error:
          req.headers.lang == "en"
            ? "Coupon not Found"
            : "كوبون الخصم غير موجود",
      });
    }
    coupon = new Coupon(coupon);
    if (id) {
      subscription = await subscriptionModule.getUserSubscripe(id, coupon.id);
      if (subscription) {
        subscription = subscription.toObject();
        subscription.paymentType.key == "ONLINE_PAYMENT"
          ? (subscription.account = await AppCreditModel.findById(
              subscription.account
            ))
          : "";
        subscription.paymentType.key == "BANK_TRANSFER"
          ? (subscription.account = await AppBankModel.findById(
              subscription.account
            ))
          : "";
        subscription = new Subscription(subscription);
      }
    }

    return res.status(200).send({
      isSuccessed: true,
      data: {
        coupon,
        subscription,
      },
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
