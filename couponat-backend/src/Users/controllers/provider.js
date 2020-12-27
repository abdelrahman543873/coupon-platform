import boom from "@hapi/boom";
import PDFDocument from "pdfkit";
import fs from "fs";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { ProviderModule } from "../modules/provider";
import { getErrorMessage } from "../../utils/handleDBError";
import { decodeToken, generateToken } from "../../utils/JWTHelper";
import { Coupon, Provider } from "../../middlewares/responsHandler";
import { CityModule } from "../../Cities/modules/city";
import { NotificationModule } from "../../CloudMessaging/module/notification";
import { CouponModule } from "../../Coupons/modules/coupon";
import { ContactModel } from "../models/contactUs";
import { ProviderModel } from "../models/provider";
import { IP } from "../../../serverIP";
import nanoid from "nanoid";

const ProviderControllers = {
  async addProvider(req, res, next) {
    console.log("controller");
    let provider = req.body;
    let logoURL = "";
    provider.email = provider.email.toLowerCase();

    if (req.file) {
      logoURL =
        "/providers-management/providers/providers-images/" + req.file.filename;
      provider.logoURL = logoURL;
    }
    let hashedPass = await hashPass(provider.password);
    provider.password = hashedPass;
    for (let i = 0; i < req.body.cities.length; i++) {
      let city = await CityModule.getById(req.body.cities[i]);
      if (!city) {
        return next(
          boom.badData(`City with Id ${req.body.cities[i]} not found`)
        );
      }
    }
    provider.code = nanoid(6);
    let { doc, err } = await ProviderModule.add(provider);

    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    provider = doc.toObject();
    let authToken = generateToken(provider._id, "PROVIDER");
    provider = new Provider(provider);

    await NotificationModule.newProviderNotification(req.headers.lang, {
      name: provider.name,
      id: provider.id,
    });
    return res.status(201).send({
      isSuccessed: true,
      data: {
        user: provider,
        authToken,
      },
      error: false,
    });
  },

  // async emailVerification(req, res, next) {
  //   let email = req.body.email.toLowerCase(),
  //     user = await ProviderModule.getByEmail(email),
  //     lang = req.headers.lang || "ar",
  //     errMsg =
  //       lang == "en" ? "This email is not exist" : "هذا البريد غير مسجل من قبل";
  //   if (!user) {
  //     return next(boom.notFound(errMsg));
  //   }
  //   res.status(200).send({
  //     isSuccessed: true,
  //     data: {
  //       isExist: true,
  //     },
  //     error: false,
  //   });
  // },

  async login(req, res, next) {
    let { email, password } = req.body,
      lang = req.headers.lang || "ar",
      user = await ProviderModule.getByEmail(email.toLowerCase()),
      errMsg =
        lang == "en"
          ? "Login cardinalities are invalid!"
          : "احداثيات المرور غير صحيحه";

    if (!user) {
      return next(boom.badData(errMsg));
    }
    console.log(user);
    if (!(await bcryptCheckPass(password, user.password))) {
      return next(boom.badData(errMsg));
    }
    let authToken = generateToken(user._id, "PROVIDER");
    user = new Provider(user);
    return res.status(200).send({
      isSuccessed: true,
      data: {
        user: user,
        authToken,
      },
      error: null,
    });
  },

  async updateProvider(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id;
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

  async changePassword(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id,
      currentPssword = req.body.currentPassword,
      newPssword = req.body.newPassword;
    let user = await ProviderModule.getById(id);
    if (!user) {
      let errMsg =
        req.headers.lang == "en"
          ? "this account not found"
          : "هذا الحساب غير موجود";
      return next(boom.badData(errMsg));
    }

    if (!(await bcryptCheckPass(currentPssword, user.password))) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Password!" : "كلمة السر غير صحيحة";
      return next(boom.badData(errMsg));
    }

    if (currentPassword == newPassword) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Same Password!" : "لا يوجد تغير في كلمة السر";
      return next(boom.badData(errMsg));
    }

    let hashedPass = await hashPass(newPssword);
    let { doc, err } = await ProviderModule.changePassword(id, hashedPass);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    return res.status(200).send({
      isSuccessed: true,
      data: new Provider(doc),
      error: null,
    });
  },

  async getAll(req, res, next) {
    let providers = await ProviderModule.getAll();
    // providers = providers.map(async (provider) => {

    // });

    for (let i = 0; i < providers.length; i++) {
      providers[i] = new Provider(providers[i]);
      let totalCount = await ProviderModule.getStatistics(providers[i].id);
      providers[i] = {
        provider: providers[i],
        totalCount,
      };
    }

    return res.status(200).send({
      isSuccessed: true,
      data: providers,
      error: null,
    });
  },

  async getAllCoupons(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id;
    let sold = req.query.sold || null;
    let provider = ProviderModule.getById(id);
    if (!provider) {
      return next(boom.badData("Provider not found"));
    }

    let coupons = await CouponModule.getAll(null, null, null, id, null, sold);

    coupons = coupons.map((coupon) => {
      return new Coupon(coupon);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  async getStatistics(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id;

    let provider = await ProviderModule.getById(id);
    if (!provider) {
      return next(boom.badData("Provider not found"));
    }

    let stat = await ProviderModule.getStatistics(provider._id);

    return res.status(200).send({
      isSuccessed: true,
      data: stat,
      error: null,
    });
  },

  async contactUs(req, res, next) {
    let { email, description } = req.body;

    let saveContact = await ContactModel({
      email,
      description,
      type: "PROVIDER",
    })
      .save()
      .catch((err) => {
        return res.status(402).send({
          isSuccessed: false,
          data: null,
          error: err,
        });
      });
    return res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },

  async getProfileInfo(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id,
      provider = await ProviderModule.getById(id);

    if (!provider) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "not found!" : "المستخدم غير موجود";
      return next(boom.badData(errMsg));
    }

    provider = new Provider(provider);

    return res.status(200).send({
      isSuccessed: true,
      data: provider,
      error: null,
    });
  },

  async emailVerification(req, res, next) {
    let email = req.body.email;
    let isFound = await ProviderModule.emailVerification(email);
    return res.status(200).send({
      isSuccessed: true,
      data: isFound,
      error: null,
    });
  },

  async search(req, res, next) {
    let name = req.query.name,
      skip = parseInt(req.query.skip) || 0,
      limit = parseInt(req.query.limit) || 0;

    let providers = await ProviderModule.search(skip, limit, name);
    providers = providers.map((provider) => {
      return new Provider(provider);
    });
    let dataCounter = await ProviderModel.countDocuments({
      name: new RegExp(name, "i"),
    });
    return res.status(200).send({
      isSuccessed: true,
      data: providers,
      dataCounter,
      error: null,
    });
  },

  async generatePDF(req, res, next) {
    let id = req.query.id || null;
    let providers = await ProviderModule.getAll(true, null, null, id, true);
    if (providers.length < 1) {
      let error =
        req.headers.lang == "en"
          ? "No Providers"
          : "لا يوجود مقدمي خدمات حاليا";
      return next(boom.unauthorized(error));
    }

    providers = providers.map((provider) => {
      return new Provider(provider);
    });

    let pdfDoc = new PDFDocument();
    let name = "AllProviders.pdf";
    name = name.trim();
    pdfDoc.pipe(fs.createWriteStream("./Providers-Images/" + name));
    pdfDoc.moveDown(25);
    pdfDoc
      .fillColor("red")
      .font("./assets/fonts/Tajawal-Bold.ttf")
      .fontSize(50) // the text and the position where the it should come
      .text("Couponat El Madina", { align: "center" });

    providers.map((provider) => {
      pdfDoc.addPage();
      let segment_array = provider.qrURL.split("/");
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
        .text(provider.name, { align: "left" });
      pdfDoc.moveDown(0.5);
      pdfDoc.image("./Providers-Images/" + last_segment, {
        width: 300,
        height: 300,
        align: "cebnter",
      });
    });
    pdfDoc.end();
    return res.status(200).send({
      isSuccessed: true,
      data: IP + "/providers-management/providers/providers-images/" + name,
      error: null,
    });
  },
};

export { ProviderControllers };
