import boom from "@hapi/boom";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import { CouponModule } from "../../Coupons/modules/coupon";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { getErrorMessage } from "../../utils/handleDBError";
import { decodeToken, generateToken } from "../../utils/JWTHelper";
import { AdminModule } from "../modules/admin";
import QRCode from "qrcode";
import { Category, Coupon, Provider } from "../../middlewares/responsHandler";
import { ProviderModule } from "../../Users/modules/provider";
import { CategoryModule } from "../../Category/modules";
import { CouponModel } from "../../Coupons/models/coupon";
import { ClientModule } from "../../Users/modules/client";
import { getSMSToken } from "../../utils/SMSToken";
import { VerificationsModule } from "../../Users/modules/verifications";
import { resetPassMailer, sendClientMail } from "../../utils/nodemailer";
import { ContactModel } from "../../Users/models/contactUs";

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
    let qrURL = QRCode.toFile("./Coupons-Images/" + fileName, coupon.code);
    coupon.qrURL = "/coupons-management/coupons-images/" + fileName;

    if (req.file) {
      console.log("1111");
      Jimp.read("Coupons-Images/" + req.file.filename).then((tpl) => {
        return Jimp.read("assets/images/logo.png")
          .then((logoTpl) => {
            logoTpl.opacity(1.0);
            console.log(logoTpl.bitmap.height);
            return tpl.composite(
              logoTpl.resize(30, 30),
              tpl.bitmap.width - logoTpl.bitmap.width - 5,
              tpl.bitmap.height - logoTpl.bitmap.height,
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
    let providers = await ProviderModule.getAll();
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

    // if (provider.isActive) {
    //   let subscriptions = await SubscripionModel.find({ provider: id });
    //   if (subscriptions.length > 0) {
    //     let errMsg =
    //       req.headers.lang == "en"
    //         ? "Cann't disactive this provider!"
    //         : "لا يمكن تعطيل مزود الخدمة";
    //     return next(boom.unauthorized(errMsg));
    //   }
    // }
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

  // async addQustion(req, res, next) {
  //   let question = req.body;
  //   let addQuest = await QuestionModule.addQuestion(question);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: addQuest,
  //     error: null,
  //   });
  // },

  // async addPackage(req, res, next) {
  //   let packages = req.body;
  //   let addPackage = await AdsPackagesModule.addPackage(packages);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: addPackage,
  //     error: null,
  //   });
  // },

  // async getFamiliarQuestions(req, res, next) {
  //   let type = req.query.type || null;
  //   let questions = await QuestionModule.getQuestions(type);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: questions,
  //     error: null,
  //   });
  // },

  // async getPackages(req, res, next) {
  //   let packages = await AdsPackagesModule.getPackages(null);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: packages,
  //     error: null,
  //   });
  // },

  // async setPackagesOff(req, res, next) {
  //   let id = req.params.id;
  //   let packages = await AdsPackagesModule.getById(id);
  //   if (!packages) {
  //     let errMsg = lang == "en" ? "Package Not found" : "الحزمة غير موجودة";
  //     return next(boom.notFound(errMsg));
  //   }
  //   packages.isActive = !packages.isActive;
  //   packages = await packages.save();
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: packages,
  //     error: null,
  //   });
  // },

  // async getCriditAcount(req, res, next) {
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: await AppCreditModel.findOne(),
  //     error: null,
  //   });
  // },

  // async updateCriditAcount(req, res, next) {
  //   let { merchantEmail, secretKey } = req.body;
  //   let cridit = await AppCreditModel.findOne();
  //   if (!cridit) {
  //     return res.status(401).send({
  //       isSuccessed: false,
  //       data: null,
  //       error: "Not Found",
  //     });
  //   }
  //   cridit.merchantEmail = merchantEmail;
  //   cridit.secretKey = secretKey;
  //   cridit = await cridit.save().catch((err) => {
  //     return res.status(401).send({
  //       isSuccessed: false,
  //       data: null,
  //       error: err,
  //     });
  //   });

  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: await AppCreditModel.findOne(),
  //     error: null,
  //   });
  // },

  // async addBanckAccount(req, res, next) {
  //   let account = req.body;
  //   let saveAccount = await AdminModule.addBankAccount(account);
  //   if (saveAccount.err) {
  //     return res.send({
  //       isSuccessed: false,
  //       data: null,
  //       error: saveAccount.err,
  //     });
  //   }
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: saveAccount.bank,
  //     error: null,
  //   });
  // },

  // async toggleBankAccount(req, res, next) {
  //   let bankId = req.params.id;

  //   let bank = await AppBankModel.findById(bankId);
  //   bank.isActive = !bank.isActive;
  //   bank = await bank.save();

  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: bank,
  //     error: null,
  //   });
  // },

  // async getBanks(req, res, next) {
  //   let banks = await AdminModule.getBanks(null);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: banks,
  //     error: null,
  //   });
  // },

  async passReq(req, res, next) {
    let cardenality = req.body.email || req.body.mobile;
    let user =
      (await ClientModule.getByMobile(cardenality)) ||
      (await ProviderModule.getByEmail(cardenality));

    if (!user) {
      let errMsg =
        req.headers.lang == "en" ? "User not Found!" : "المستخدم غير مسجل";
      return next(boom.notFound(errMsg));
    }
    console.log(user);
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
    if (req.body.email) {
      resetPassMailer(user.name, mailMessage + smsToken, cardenality);
      msg =
        (req.headers.lang == "en"
          ? "email sent to you, follow it to change your password."
          : "تم ارسال التعليمات الى بريدك الالكترونى من فضلك قم بأتباعها") +
        doc.code;
      return res.status(200).send({
        isSuccessed: true,
        data: msg,
        error: null,
      });
    } else if (req.body.mobile) {
      res.status(201).send({
        isSuccessed: true,
        data: smsToken,
        error: null,
      });
    }
  },

  async checkResetCode(req, res, next) {
    let cardenality = req.body.email || req.body.mobile;
    let code = req.body.code;
    let user =
      (await ClientModule.getByMobile(cardenality)) ||
      ProviderModule.getByEmail(cardenality);

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
    return res.status(200).send({
      isSuccessed: true,
      data: await ContactModel.find({}, { _id: 0 }),
      error: null,
    });
  },

  async mailReply(req, res, next) {
    let { email, reply } = req.body;
    sendClientMail("Couponat El-Madena", reply, email);

    return res.status(200).send({
      isSuccessed: true,
      data: "check email to show replay state",
      error: null,
    });
  },
};

export { AdminsController };
