import boom from "@hapi/boom";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import { CouponModule } from "../../Coupons/modules/coupon";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { getErrorMessage } from "../../utils/handleDBError";
import { decodeToken, generateToken } from "../../utils/JWTHelper";
import { AdminModule } from "../modules/admin";
import QRCode from "qrcode";
import {
  Category,
  Coupon,
  Cridit,
  Provider,
} from "../../middlewares/responsHandler";
import { ProviderModule } from "../../Users/modules/provider";
import { CategoryModule } from "../../Category/modules";
import { CouponModel } from "../../Coupons/models/coupon";
import { ClientModule } from "../../Users/modules/client";
import { getSMSToken } from "../../utils/SMSToken";
import { VerificationsModule } from "../../Users/modules/verifications";
import { sendClientMail } from "../../utils/nodemailer";
import { ContactModel } from "../../Users/models/contactUs";
import { NotificationModule } from "../../CloudMessaging/module/notification";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
import { AppCreditModel } from "../../Purchasing/models/appCridit";

const AdminsController = {
  async add(req, res, next) {
    let { email, name, password } = req.body,
      auth = await decodeToken(req.headers.authentication);
    let hashedPass = await hashPass(password);
    console.log(auth);
    if (auth && auth.type != "BOSS") {
      let errMsg =
        req.headers.lang == "en" ? "Not  Allowed!" : "ليس لديك الصلاحية";
      return next(boom.unauthorized(errMsg));
    }

    let { user, err } = await AdminModule.add(email, name, hashedPass);
    if (err) {
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    }
    let admin = user.toObject();
    delete admin.password;

    return res.status(201).send({
      isSuccessed: true,
      data: {
        admin: admin,
        authToken: null,
      },
      error: null,
    });
  },

  async login(req, res, next) {
    let { email, password } = req.body,
      lang = req.headers.lang,
      admin = await AdminModule.getByEmail(email),
      type = "";
    if (!admin) {
      let errMsg = lang == "en" ? "Wrong email" : "البريد الاكترونى غير موجود";
      return next(boom.notFound(errMsg));
    }
    console.log(password + "  " + admin);
    if (!(await bcryptCheckPass(password, admin.password))) {
      let errMsg = lang == "en" ? "Wrong password" : "كلمة المرور غير صحيحه";
      return next(boom.badData(errMsg));
    }
    type = email == "Boss@gmail.com" ? "BOSS" : "ADMIN";
    let authToken = generateToken(admin._id, type);
    admin = admin.toObject();

    delete admin.password;
    return res.status(200).send({
      isSuccessed: true,
      data: {
        admin,
        authToken,
      },
      error: null,
    });
  },

  async addCoupon(req, res, next) {
    let coupon = req.body,
      imgURL = "";

    let provider = await ProviderModule.getById(req.params.id);
    if (!provider) {
      let errMsg =
        req.headers.lang == "en"
          ? "Provider not found"
          : "مقد الخدمة غير موجود";
      return next(boom.notFound(errMsg));
    }

    coupon.provider = req.params.id;
    coupon.code = nanoid(6);
    let fileName = coupon.code + Date.now() + ".png";
    let qrURL = QRCode.toFile("./Coupons-Images/" + fileName, coupon.code, {
      color: {
        dark: "#575757", // Blue dots
        light: "#0000", // Transparent background
      },
    });
    coupon.qrURL = "/coupons-management/coupons-images/" + fileName;

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

  async updateProvider(req, res, next) {
    let id = req.params.id;

    let newData = req.body;
    if (req.file) {
      let logoURL =
        "/providers-management/providers/providers-images/" + req.file.filename;
      newData.logoURL = logoURL;
    }
    console.log(id);
    let { doc, err } = await ProviderModule.updateProvider(id, newData);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    console.log("doc: ", doc);
    return res.status(200).send({
      isSuccessed: true,
      data: new Provider(doc),
      error: null,
    });
  },

  async getProviders(req, res, next) {
    let limit = parseInt(req.query.limit) || null;
    let skip = parseInt(req.query.skip) || null;
    let providers = await ProviderModule.getAll("true", limit, skip);
    providers = providers.map((provider) => {
      return new Provider(provider);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: providers,
      error: null,
    });
  },

  async deleteProvider(req, res, next) {
    let id = req.params.id;
    let coupons = await CouponModule.getAll(null, null, null, id, null);
    if (coupons.err) {
      return next(boom.unauthorized(coupons.err));
    }
    if (coupons.length > 0) {
      console.log(coupons);
      let errMsg =
        req.headers.lang == "en"
          ? "Cann't remove this Provider!"
          : "لا يمكن حذف هذا المستخدم";
      return next(boom.unauthorized(errMsg));
    }

    let { doc, err } = await ProviderModule.delete(id);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    console.log("doc: ", doc);
    return res.status(200).send({
      isSuccessed: true,
      data: doc,
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
      let errMsg =
        req.headers.lang == "en" ? "Category not found" : "التصنيف غير موجود";
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

  async deleteCategory(req, res, next) {
    let id = req.params.id;
    let category = await CategoryModule.getById(id);

    if (!category) {
      let errMsg =
        req.headers.lang == "en" ? "Category not found" : "التصنيف غير موجود";
      return next(boom.notFound(errMsg));
    }

    let coupons = await CouponModule.getAll(null, null, id, null, null);
    if (coupons.err) {
      return next(boom.unauthorized(coupons.err));
    }
    if (coupons.length > 0) {
      let errMsg =
        req.headers.lang == "en"
          ? "Cann't remove this Category!"
          : "لا يمكن حذف هذا التصنيف";
      return next(boom.unauthorized(errMsg));
    }

    let { doc, err } = await CategoryModule.delete(id);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    console.log("doc: ", doc);
    return res.status(200).send({
      isSuccessed: true,
      data: doc,
      error: null,
    });
  },

  async getAllCategories(req, res, next) {
    let categories = await CategoryModule.getAll();
    categories = categories.map((category) => {
      return new Category(category);
    });

    for (let i = 0; i < categories.length; i++) {
      categories[i].totalCoupons = await CouponModel.countDocuments({
        totalCount: { $gt: 0 },
        category: categories[i].id,
      });
      console.log(categories[i].totalCount);
    }
    return res.status(200).send({
      isSuccessed: true,
      data: categories,
      error: null,
    });
  },

  async toggleProviders(req, res, next) {
    let id = req.params.id;
    let provider = await ProviderModule.getById(id);
    if (!provider) {
      let errMsg =
        req.headers.lang == "en"
          ? "Provider not found"
          : "مقدم الخدمة غير موجود";
      return next(boom.unauthorized(errMsg));
    }

    provider.isActive = !provider.isActive;
    provider = await provider.save();

    let coupons = await CouponModel.find({ provider: id }, { _id: 1 });
    for (let i = 0; i < coupons.length; i++) {
      coupons[i] = coupons[i]._id;
    }

    let updateCoupons = await CouponModel.updateMany(
      {
        _id: { $in: coupons },
      },
      { $set: { isActive: provider.isActive } }
    ).catch((err) => {
      return next(boom.unauthorized(err));
    });
    provider = new Provider(provider);
    return res.status(200).send({
      isSuccessed: true,
      data: provider,
      error: null,
    });
  },

  async getCriditAcount(req, res, next) {
    let cridit = await AppCreditModel.findOne();
    cridit = new Cridit(cridit);
    return res.status(200).send({
      isSuccessed: true,
      data: cridit,
      error: null,
    });
  },

  async updateCriditAcount(req, res, next) {
    let merchantEmail = req.body.merchantEmail || null;
    let secretKey = req.body.secretKey || null;
    let cridit = await AppCreditModel.findOne();
    if (!cridit) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: "Not Found",
      });
    }
    merchantEmail ? (cridit.merchantEmail = merchantEmail) : "";
    secretKey ? (cridit.secretKey = secretKey) : "";
    cridit = await cridit.save().catch((err) => {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    });
    cridit = new Cridit(cridit);
    return res.status(200).send({
      isSuccessed: true,
      data: cridit,
      error: null,
    });
  },

  async passReq(req, res, next) {
    let cardenality = req.body.cardenality;
    let user = cardenality.includes("@")
      ? await ProviderModule.getByEmail(cardenality)
      : await ClientModule.getByMobile(cardenality);

    if (!user) {
      let errMsg =
        req.headers.lang == "en" ? "User not Found!" : "المستخدم غير مسجل";
      return next(boom.notFound(errMsg));
    }

    let smsToken = getSMSToken(5);
    let addVerification = await VerificationsModule.add(smsToken, user._id);
    if (addVerification.err)
      return next(
        boom.badData(
          getErrorMessage(addVerification.err, req.headers.lang || "ar")
        )
      );

    let mailMessage =
        req.headers.lang == "en"
          ? "Enter this code to reset password: "
          : "ادخل هذا الرمز لاعادة تعين كلمة السر: ",
      msg = "";

    console.log(addVerification);
    if (cardenality.includes("@")) {
      sendClientMail(
        "Reset Password Code",
        mailMessage + smsToken,
        cardenality
      );
      msg =
        (req.headers.lang == "en"
          ? "email sent to you, follow it to change your password."
          : "تم ارسال التعليمات الى بريدك الالكترونى من فضلك قم بأتباعها") +
        smsToken;
      return res.status(200).send({
        isSuccessed: true,
        data: msg,
        error: null,
      });
    } else {
      console.log("done");
      return res.status(201).send({
        isSuccessed: true,
        data: smsToken,
        error: null,
      });
    }
  },

  async checkResetCode(req, res, next) {
    let cardenality = req.body.cardenality;
    let code = req.body.code;
    let user = cardenality.includes("@")
      ? await ProviderModule.getByEmail(cardenality)
      : await ClientModule.getByMobile(cardenality);

    if (!user) {
      let errMsg =
        req.headers.lang == "en" ? "User not Found!" : "المستخدم غير مسجل";
      return next(boom.notFound(errMsg));
    }

    let verification = await VerificationsModule.get(user._id, code);
    if (verification.err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));

    if (!verification.doc) {
      let errMsg =
        req.headers.lang == "en"
          ? "No previous record for this token!, add phone number or check the token please"
          : "لا يوجد بيانات سابقه لهذا الرمز فى التحقيقات";
      return next(boom.notFound(errMsg));
    }

    let nowDate = new Date();
    let diffInMilliSeconds = (nowDate - verification.doc.createdAt) / 1000;
    let diffInMinuts = Math.floor(diffInMilliSeconds / 60) % 60;
    if (diffInMinuts > 1) {
      let deleteCode = await VerificationsModule.delete(user._id);
      let errMsg =
        req.headers.lang == "en"
          ? "This token has exceeded the verification time of 1 minut please resend it"
          : "رمز التحقيق قد تعدى الوقت المسموح به ( دقيقه واحده ) قم بأعدة ارساله";
      return next(boom.notFound(errMsg));
    }
    return res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },

  async changePassword(req, res, next) {
    let { password, code } = req.body;

    let verification = await VerificationsModule.getByCode(code);
    console.log(code);
    console.log(verification);
    if (!verification.doc) {
      let errMsg =
        req.headers.lang == "en"
          ? "No previous record for this token!, add phone number or check the token please"
          : "لا يوجد بيانات سابقه لهذا الرمز فى التحقيقات";
      return next(boom.notFound(errMsg));
    }

    if (password.length < 8)
      return next(boom.badRequest("Password must be more than 7 characters"));

    let user =
      (await ProviderModule.getById(verification.doc.user)) ||
      (await ClientModule.getById(verification.doc.user));

    user.password = await hashPass(password);
    user.save();
    let deleteCode = await VerificationsModule.delete(user._id);
    res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },

  async getStatistics(req, res, next) {
    let stat = await AdminModule.getStatistics();
    return res.status(200).send({
      isSuccessed: true,
      data: stat,
      error: null,
    });
  },

  async mails(req, res, next) {
    let skip = req.query.skip || null,
      limit = req.query.limit || null;
    return res.status(200).send({
      isSuccessed: true,
      data: await ContactModel.find()
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      error: null,
    });
  },

  async mailReply(req, res, next) {
    let id = req.params.id;
    let mail = checkAllMongooseId(id) ? await ContactModel.findById(id) : null;
    if (!mail) {
      let errMsg =
        req.headers.lang == "en"
          ? "No Mail to reply it"
          : "لا يوجد رساله للرد عليها";
      return next(boom.notFound(errMsg));
    }
    let reply = req.body.reply;
    sendClientMail("Couponat El-Madena", reply, mail.email);

    mail.reply = {
      message: reply,
      date: new Date(),
    };
    console.log(mail);
    mail = await mail.save();

    return res.status(200).send({
      isSuccessed: true,
      data: "check email to show replay state",
      error: null,
    });
  },

  async deleteMail(req, res, next) {
    let id = req.params.id;
    let { doc, err } = await AdminModule.deleteMail(id);
    if (err) {
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    }
    return res.status(200).send({
      isSuccessed: true,
      data: doc,
      error: null,
    });
  },

  async changeName(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let name = req.body.name;
    let { doc, err } = await AdminModule.update(id, { name: name });
    if (err) {
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    }
    doc = doc.toObject();
    delete doc.password;
    return res.status(200).send({
      isSuccessed: true,
      data: doc,
      error: null,
    });
  },

  async AdminchangePassword(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let { currentPassword, newPassword } = req.body;

    let user = await AdminModule.getById(id);
    if (!user) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "this account not found" : "هذا الحساب غير موجود";
      return next(boom.notFound(errMsg));
    }

    if (!(await bcryptCheckPass(currentPassword, user.password))) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Password!" : "كلمة السر غير صحيحة";
      return next(boom.badData(errMsg));
    }

    if (currentPassword == newPassword) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Same Password!" : "لا يوجد تغير في كلمة السر";
      return next(boom.badData(errMsg));
    }

    user.password = await hashPass(newPassword);
    user = await user.save();
    user = user.toObject();
    delete user.password;

    return res.status(200).send({
      isSuccessed: true,
      data: user,
      error: null,
    });
  },

  async changeMailReq(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let user = await AdminModule.getById(id);
    if (!user) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "this account not found" : "هذا الحساب غير موجود";
      return next(boom.notFound(errMsg));
    }

    let smsToken = getSMSToken(5);
    let addVerification = await VerificationsModule.add(smsToken, user._id);
    if (addVerification.err)
      return next(
        boom.badData(
          getErrorMessage(addVerification.err, req.headers.lang || "ar")
        )
      );

    let mailMessage =
        req.headers.lang == "en"
          ? "Enter this code to reset password: "
          : "ادخل هذا الرمز لاعادة تعين كلمة السر: ",
      msg = "";
    sendClientMail("Reset Password Code", mailMessage + smsToken, user.email);
    msg =
      (req.headers.lang == "en"
        ? "email sent to you, follow it to change your password."
        : "تم ارسال التعليمات الى بريدك الالكترونى من فضلك قم بأتباعها") +
      smsToken;
    return res.status(200).send({
      isSuccessed: true,
      data: msg,
      error: null,
    });
  },

  async changeMail(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let user = await AdminModule.getById(id);
    if (!user) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "this account not found" : "هذا الحساب غير موجود";
      return next(boom.notFound(errMsg));
    }

    let { email, code } = req.body;

    let verification = await VerificationsModule.get(user._id, code);
    if (verification.err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));

    if (!verification.doc) {
      let errMsg =
        req.headers.lang == "en"
          ? "No previous record for this token!, add phone number or check the token please"
          : "لا يوجد بيانات سابقه لهذا الرمز فى التحقيقات";
      return next(boom.notFound(errMsg));
    }

    let nowDate = new Date();
    let diffInMilliSeconds = (nowDate - verification.doc.createdAt) / 1000;
    let diffInMinuts = Math.floor(diffInMilliSeconds / 60) % 60;
    if (diffInMinuts > 1) {
      let deleteCode = await VerificationsModule.delete(user._id);
      let errMsg =
        req.headers.lang == "en"
          ? "This token has exceeded the verification time of 1 minut please resend it"
          : "رمز التحقيق قد تعدى الوقت المسموح به ( دقيقه واحده ) قم بأعدة ارساله";
      return next(boom.notFound(errMsg));
    }

    user.email = email;
    user = user.save();
    user = user.toObject();
    delete user.password;

    return res.status(200).send({
      isSuccessed: true,
      data: user,
      error: null,
    });
  },
};

export { AdminsController };
