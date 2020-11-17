import boom from "@hapi/boom";
import { ClientModule } from "../modules/client";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { getErrorMessage } from "../../utils/handleDBError";
import { getSMSToken } from "../../utils/SMSToken";
import { VerificationsModule } from "../modules/verifications";
import { decodeToken, generateToken } from "../../utils/JWTHelper";
import {
  Category,
  Client,
  Coupon,
  Provider,
} from "../../middlewares/responsHandler";
import { ProviderModule } from "../modules/provider";
import { CategoryModule } from "../../Category/modules";
import { CouponModule } from "../../Coupons/modules/coupon";
import { ContactModel } from "../models/contactUs";
import { subscriptionModule } from "../../Purchasing/modules/subscription";

const ClientControllers = {
  async add(req, res, next) {
    let { name, mobile, countryCode, password } = req.body,
      hashedPassword = await hashPass(password);
    let imgURL = "";
    if (req.file) {
      imgURL =
        "/customers-management/customers/customers-images/" + req.file.filename;
    }
    let { doc, err } = await ClientModule.add(
      name,
      mobile,
      countryCode,
      hashedPassword,
      imgURL
    );

    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));

    let client = new Client(doc.toObject());
    console.log(client);
    let smsToken = getSMSToken(5);
    let addVerification = await VerificationsModule.add(smsToken, client.id);
    if (addVerification.err)
      return next(
        boom.badData(
          getErrorMessage(addVerification.err, req.headers.lang || "ar")
        )
      );
    // let smsMessage =
    //   req.headers.lang == "en"
    //     ? "Bazaar app : welcome to bazaar your verification code is "
    //     : "تطبيق بازار : مرحبا بك في تطبيق بازار الرمز التاكيدي لحسابك هو ";
    // smsToken = await Messages.sendMessage(countryCode+mobile, smsMessage + smsToken);
    res.status(201).send({
      isSuccessed: true,
      data: {
        user: client,
        smsToken,
      },
      error: null,
    });
  },

  async home(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth ? auth.id : null;
    let providers = await ProviderModule.getAll();
    let categories = await CategoryModule.getAll();
    let newest = await CouponModule.getAll(0, 20, null, null, "newest");
    if (newest.err) {
      return next(boom.unauthorized(coupons.err));
    }
    let mostSeller = await CouponModule.getAll(0, 20, null, null, "bestSeller");
    if (mostSeller.err) {
      return next(boom.unauthorized(coupons.err));
    }
    newest = newest.map((cuopon) => {
      return new Coupon(cuopon);
    });
    mostSeller = mostSeller.map((cuopon) => {
      return new Coupon(cuopon);
    });

    let user = await ClientModule.getById(id);
    console.log(providers);
    if (user && user.favCoupons) {
      newest = await addFavProp(newest, user.favCoupons);
      mostSeller = await addFavProp(mostSeller, user.favCoupons);
    } else {
      newest = await addFavProp(newest, null);
      mostSeller = await addFavProp(mostSeller, null);
    }
    for (let i = 0; i < mostSeller.length; i++) {
      let sub = user
        ? await subscriptionModule.getUserSubscripe(user.id, mostSeller[i].id)
        : null;
      mostSeller[i].isSubscribe = sub ? true : false;
    }

    for (let i = 0; i < newest.length; i++) {
      let sub = user
        ? await subscriptionModule.getUserSubscripe(user.id, newest[i].id)
        : null;
      newest[i].isSubscribe = sub ? true : false;
    }
    res.status(201).send({
      isSuccessed: true,
      data: {
        providers: providers.map((provider) => {
          return new Provider(provider);
        }),
        categories: categories.map((category) => {
          return new Category(category);
        }),
        newest: newest,
        bestSeller: mostSeller,
      },
      error: null,
    });
  },

  async socialMediaRegister(req, res, next) {
    let {
      name,
      socialMediaId,
      socialMediaType,
      mobile,
      countryCode,
      imgURL,
    } = req.body;

    let user = await ClientModule.getByMobile(mobile);
    if (user) {
      let errMsg =
        req.headers.lang == "en"
          ? "Mobile Used befor"
          : "رقم مستخدم من حساب أخر";
      return next(boom.notFound(errMsg));
    }
    let { doc, err } = await ClientModule.addViaSocialMedia({
      name,
      socialMediaId,
      socialMediaType,
      mobile,
      countryCode,
      imgURL,
    });
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    let client = new Client(doc.toObject());
    res.status(201).send({
      isSuccessed: true,
      data: client,
      error: null,
    });
  },

  async auth(req, res, next) {
    let { mobile, password } = req.body,
      lang = req.headers.lang || "ar",
      user = await ClientModule.getByMobile(mobile),
      errMsg =
        lang == "en"
          ? "Login cardinalities are invalid!"
          : "احداثيات المرور غير صحيحه",
      authToken = "";

    if (!user || !user.password) {
      return next(boom.notFound(errMsg));
    }
    console.log(password);
    console.log(user);

    if (!(await bcryptCheckPass(password, user.password))) {
      return next(boom.unauthorized(errMsg));
    }
    if (user.isVerified) authToken = generateToken(user._id, "CLIENT");
    user = new Client(user);
    return res.status(200).send({
      isSuccessed: true,
      data: {
        user: user,
        authToken,
      },
      error: null,
    });
  },

  async verifyMobile(req, res, next) {
    let code = req.body.smsToken,
      id = req.params.id;
    let verification = await VerificationsModule.get(id, code);
    if (verification.err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));

    if (!verification.doc) {
      let errMsg =
        req.headers.lang == "en"
          ? "No previous record for this token!, add phone number or check the token please"
          : "لا يوجد بيانات سابقه لهذا الرمز فى التحقيقات";
      return next(boom.notFound(errMsg));
    }
    let deleteCode = await VerificationsModule.delete(id);
    let nowDate = new Date();
    let diffInMilliSeconds = (nowDate - verification.doc.createdAt) / 1000;
    let diffInMinuts = Math.floor(diffInMilliSeconds / 60) % 60;
    if (diffInMinuts > 1) {
      let errMsg =
        req.headers.lang == "en"
          ? "This token has exceeded the verification time of 1 minut please resend it"
          : "رمز التحقيق قد تعدى الوقت المسموح به ( دقيقه واحده ) قم بأعدة ارساله";
      return next(boom.notFound(errMsg));
    }

    let user = await ClientModule.verify(id);
    let authToken = generateToken(user._id, "CLIENT");
    user = new Client(user);
    return res.status(200).send({
      isSuccessed: true,
      data: {
        user: user,
        authToken,
      },
      error: null,
    });
  },

  async resendMobileVerification(req, res, next) {
    let id = req.params.id,
      lang = req.headers.lang || "ar",
      client = await ClientModule.getById(id);

    if (!client) {
      let errMsg = lang == "en" ? "Client not found" : "المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }

    if (client.isVerified) {
      let errMsg =
        lang == "en"
          ? "Client mobile is already verified"
          : "جوال المستخدم متوثق من قبل";
      return next(boom.notFound(errMsg));
    }

    let smsToken = getSMSToken(5);
    let deleteCode = await VerificationsModule.delete(id);
    let addToVerificationRes = await VerificationsModule.add(
      smsToken,
      client._id
    );
    if (addToVerificationRes.err)
      return next(
        boom.badData(
          getErrorMessage(addToVerificationRes.err, req.headers.lang || "ar")
        )
      );
    // let smsMessage =
    //   req.headers.lang == "en"
    //     ? "Bazaar app : welcome to bazaar your verification code is "
    //     : "تطبيق بازار : مرحبا بك في تطبيق بازار الرمز التاكيدي لحسابك هو ";
    //  smsToken = await Messages.sendMessage(countryCode+mobile, smsMessage + smsToken);
    return res.status(200).send({
      isSuccessed: true,
      data: smsToken,
      error: null,
    });
  },

  async socialAuth(req, res, next) {
    let socialMediaId = req.body.socialMediaId;
    let user = await ClientModule.getBySocialMediaId(socialMediaId);
    if (user) {
      user = new Client(user);
      if (!user.isVerified) {
        return res.status(200).send({
          isSuccessed: true,
          data: {
            user,
            token: null,
          },
          error: "User not verified!",
        });
      } else {
        let authToken = generateToken(user.id, "CLIENT");
        return res.status(200).send({
          isSuccessed: true,
          data: {
            user: user,
            authToken,
          },
          error: null,
        });
      }
    }

    return res.status(404).send({
      isSuccessed: false,
      data: null,
      error: "user not found",
    });
  },

  async asyncFavCoupons(req, res, next) {
    let coupons = req.body.coupons;
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let user = await ClientModule.getById(id);
    if (!user) {
      let errMsg =
        req.headers.lang == "en" ? "user not found" : "المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }

    user.favCoupons = user.favCoupons.concat(coupons);
    for (let i = 0; i < user.favCoupons.length; i++) {
      console.log(typeof user.favCoupons[i]);
      user.favCoupons[i] = user.favCoupons[i] + "";
    }
    user.favCoupons = Array.from(new Set(user.favCoupons));
    user = await user.save();
    coupons = await ClientModule.getFavCoupons(user._id);
    coupons = coupons.map((coupon) => {
      return new Coupon(coupon);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  async updateFavCoupons(req, res, next) {
    let couponId = req.params.id,
      auth = await decodeToken(req.headers.authentication),
      userId = auth.id,
      lang = req.headers.lang || "ar";
    let doc = await CouponModule.getById(couponId);
    if (!doc) {
      let errMsg =
        req.headers.lang == "en" ? "Coupon not found" : "كوبون الخصم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let user = await ClientModule.toggleCouponInFavs(userId, couponId);
    if (!user) {
      let errMsg = lang == "en" ? "user not found" : "المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let favCoupons = user.favCoupons;

    let favArray = [];
    favCoupons.map((favCop) => {
      let obj = {
        id: favCop,
      };
      favArray.push(obj);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },

  async getFavCoupons(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      userId = auth.id;
    let coupons = await ClientModule.getFavCoupons(userId);
    coupons = coupons.map((coupon) => {
      coupon = new Coupon(coupon);
      coupon.isFav = true;
      return coupon;
    });
    for (let i = 0; i < coupons.length; i++) {
      let sub = await subscriptionModule.getUserSubscripe(
        userId,
        coupons[i].id
      );
      coupons[i].isSubscribe = sub ? true : false;
    }

    return res.status(200).send({
      isSuccessed: true,
      data: coupons,
      error: null,
    });
  },

  // async getProfile(req, res, next) {
  //   let id = req.body.authId;
  //   let client = await ClientModule.getById(id);
  //   if (!client) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "not found" : "مستخدم غير موجود";
  //     return next(boom.notFound(errMsg));
  //   }
  //   client = client.toObject();
  //   delete client.password;

  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: client,
  //     error: null,
  //   });
  // },

  async changePassword(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let { currentPassword, newPassword } = req.body;
    let user = await ClientModule.getById(id);
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
    user = new Client(user);
    return res.status(200).send({
      isSuccessed: true,
      data: user,
      error: null,
    });
  },

  async changeMobile(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let { mobile } = req.body,
      smsToken = getSMSToken(5);
    let user = await ClientModule.getById(id);
    if (!user) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "this account not found" : "هذا الحساب غير موجود";
      return next(boom.notFound(errMsg));
    }
    if (user.mobile == mobile) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Same mobile number" : "نفس رقم الهاتف";
      return next(boom.notFound(errMsg));
    }
    user.mobile = mobile;
    user.isVerified = false;
    user = await user.save();
    user = new Client(user);
    let addVerification = await VerificationsModule.add(smsToken, user.id);
    if (addVerification.err)
      return next(
        boom.badData(
          getErrorMessage(addVerification.err, req.headers.lang || "ar")
        )
      );
    // let smsMessage =
    //   req.headers.lang == "en"
    //     ? "Bazaar app : welcome to bazaar your verification code is "
    //     : "تطبيق بازار : مرحبا بك في تطبيق بازار الرمز التاكيدي لحسابك هو ";
    // // smsToken = await Messages.sendMessage(
    // //   req.body.countryCode+req.body.mobile,
    // //   smsMessage + smsToken
    // // );
    return res.status(200).send({
      isSuccessed: true,
      data: {
        user: user,
        smsToken,
      },
      error: null,
    });
  },

  async contactUs(req, res, next) {
    let { email, description } = req.body;

    let saveContact = await ContactModel({ email, description, type: "ClIENT" })
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

  async changeProfile(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id;
    let user = await ClientModule.getById(id);
    if (!user) {
      let lang = req.headers.lang || "ar",
        errMsg =
          lang == "en" ? "this account not found" : "هذا الحساب غير موجود";
      return next(boom.notFound(errMsg));
    }

    let imgURL = "";
    if (req.file) {
      imgURL =
        "/customers-management/customers/customers-images/" + req.file.filename;
    }
    user.imgURL = imgURL;
    user = await user.save();
    user = new Client(user);

    return res.status(200).send({
      isSuccessed: true,
      data: user,
      error: null,
    });
  },

  async getProfileInfo(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      id = auth.id,
      client = await ClientModule.getById(id);

    if (!client) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "not found!" : "المستخدم غير موجود";
      return next(boom.badData(errMsg));
    }

    client = new Client(client);

    return res.status(200).send({
      isSuccessed: true,
      data: client,
      error: null,
    });
  },

  // async getFamiliarQuestions(req, res, next) {
  //   let lang = req.headers.lang || "ar";
  //   let questions = await QuestionModule.getQuestions("CLIENT", lang);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: questions,
  //     error: null,
  //   });
  // },
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

export { ClientControllers };
