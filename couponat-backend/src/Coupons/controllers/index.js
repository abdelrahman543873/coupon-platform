import boom from "@hapi/boom";
import { getErrorMessage } from "../../utils/handleDBError";
import { CouponModule } from "../modules/coupon";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { Coupon } from "../../middlewares/responsHandler";
import { decodeToken } from "../../utils/JWTHelper";
import Jimp from "jimp";
import PDFDocument from "pdfkit";
import fs from "fs";
import { IP } from "../../../serverIP";
import { ClientModule } from "../../Users/modules/client";

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
    coupon.qrURL = "/coupons-management/coupons-images/" + fileName;

    if (req.file) {
      let diffHight = 0,
        diffWidth = 0;
      console.log("1111");
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("src/logo.png")
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
    if (user && user.favCoupons)
      coupons = await addFavProp(coupons, user.favCoupons);
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

    let coupon = await CouponModule.getById(id);
    if (!coupon) {
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
      console.log("1111");
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("src/logo.png")
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

    let coupon = await CouponModule.getById(id);
    if (!coupon) {
      let errMsg =
        req.headers.lang == "en" ? "Coupon not found" : "كوبون الخصم غير موجود";
      return next(boom.notFound(errMsg));
    }

    let { doc, err } = await CouponModule.delete(id);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    console.log("doc: ", doc);
    return res.status(200).send({
      isSuccessed: true,
      data: doc,
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
      null
    );
    coupons = coupons.map((coupon) => {
      return new Coupon(coupon);
    });
    let user = await ClientModule.getById(id);
   // console.log(user.favCoupons);
    if (user && user.favCoupons)
      coupons = await addFavProp(coupons, user.favCoupons);
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  async generatePDF(req, res, next) {
    let id = req.query.id || null;
    let coupons = await CouponModule.getAll(null, null, null, id, null);

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
    pdfDoc.pipe(fs.createWriteStream("./Coupons-Images/Coupons.pdf"));
    pdfDoc.moveDown(25);
    pdfDoc
      .fillColor("red")
      .font("Times-Bold")
      .fontSize(50) // the text and the position where the it should come
      .text("Couponat El Madina", { align: "center" });

    coupons.map((coupon) => {
      pdfDoc.addPage();
      let segment_array = coupon.qrURL.split("/");
      let last_segment = segment_array.pop();
      pdfDoc
        .fillColor("blue")
        .fontSize(20)
        .text("Provider: ", {
          continued: true,
        })
        .fillColor("black")
        .fontSize(20)
        .text(coupon.provider.name, { align: "left" });
      pdfDoc.moveDown(0.5);
      pdfDoc
        .fillColor("blue")
        .fontSize(20)
        .text("Name: ", {
          continued: true,
        })
        .fillColor("black")
        .fontSize(20)
        .text(coupon.name.english, { align: "left" });
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
      data: IP + "/coupons-management/coupons-images/Coupons.pdf",
      error: null,
    });
  },
};

async function addFavProp(coupons, userFav) {
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
export { CouponController };
