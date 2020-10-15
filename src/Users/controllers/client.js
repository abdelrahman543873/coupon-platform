import boom from "@hapi/boom";
import { ClientModule } from "../modules/client";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { getErrorMessage } from "../../utils/handleDBError";
import { getSMSToken } from "../../utils/SMSToken";
import { VerificationsModule } from "../modules/verifications";
import { generateToken } from "../../utils/JWTHelper";
import { Messages } from "../../utils/twilloHelper";
import { IP } from "../../../serverIP";
import { Client } from "../../middlewares/responsHandler";

const ClientControllers = {
  async add(req, res, next) {
    let { name, mobile, countryCode, password } = req.body,
      hashedPassword = await hashPass(password);
    let { doc, err } = await ClientModule.add(
      name,
      mobile,
      countryCode,
      hashedPassword
    );

    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));

    let client = new Client(doc.toObject());
    console.log(client);
    let smsToken = getSMSToken(5);
    let addVerification = await VerificationsModule.add(
      smsToken,
      client.id,
      client.countryCode + client.mobile
    );
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

  // async addViaSocialMedia(
  //   email = "",
  //   username,
  //   socialMediaId,
  //   socialMediaType,
  //   userPicUrl = ""
  // ) {
  //   email = email.toLowerCase();
  //   let { doc, err } = await ClientModule.addViaSocialMedia({
  //     username,
  //     email,
  //     imgURL: userPicUrl,
  //     socialMediaId,
  //     socialMediaType,
  //   });

  //   if (err)
  //     return {
  //       user: null,
  //       err,
  //     };

  //   let client = doc.toObject();
  //   delete client.password;
  //   return {
  //     user: client,
  //     err: null,
  //   };
  // },

  async auth(req, res, next) {
    let { mobile, password } = req.body,
      lang = req.headers.lang || "ar",
      user = await ClientModule.getByMobile(mobile),
      errMsg =
        lang == "en"
          ? "Login cardinalities are invalid!"
          : "احداثيات المرور غير صحيحه",
      authToken = "";

    if (!user) {
      return next(boom.notFound(errMsg));
    }
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
      client._id,
      client.countryCode + client.mobile
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

  // async socialAuth(req, res, next) {
  //   let socialMediaId = req.body.socialMediaId;
  //   let user = await ClientModule.getBySocialMediaId(socialMediaId);
  //   if (user) {
  //     user = user.toObject();
  //     delete user.password;
  //     if (!user.isVerified) {
  //       // is supposed to be 302 and contains the redirect data!
  //       return res.status(200).send({
  //         isSuccessed: true,
  //         data: {
  //           user,
  //           token: null,
  //         },
  //         error: "User not verified!",
  //       });
  //     } else {
  //       let authToken = generateToken(user._id, "CUSTOMER");
  //       return res.status(200).send({
  //         isSuccessed: true,
  //         data: {
  //           user: user,
  //           authToken,
  //         },
  //         error: null,
  //       });
  //     }
  //   } else {
  //     let { email, username, socialMediaType, userPicURL = "" } = req.body;

  //     user = await ClientModule.getByEmail(email);
  //     if (user) {
  //       user = await ClientModule.fillSocialMediaData(
  //         user,
  //         socialMediaId,
  //         socialMediaType,
  //         userPicURL
  //       );
  //       if (!user)
  //         return next(boom.internal("Error filling social media data"));
  //       let authToken = generateToken(user._id, "CUSTOMER");
  //       return res.status(200).send({
  //         isSuccessed: true,
  //         data: {
  //           user: user,
  //           authToken,
  //         },
  //         error: null,
  //       });
  //     } else {
  //       let registerationRes = await ClientControllers.addViaSocialMedia(
  //         email,
  //         username,
  //         socialMediaId,
  //         socialMediaType,
  //         userPicURL
  //       );
  //       if (registerationRes.err) {
  //         return next(
  //           boom.badData(
  //             getErrorMessage(registerationRes.err, req.headers.lang || "ar")
  //           )
  //         );
  //       }
  //       return res.status(201).send({
  //         isSuccessed: true,
  //         data: {
  //           user: registerationRes.user,
  //           authToken: null,
  //         },
  //         error: null,
  //       });
  //     }
  //   }
  // },

  // async updateFavProducts(req, res, next) {
  //   let productId = req.params.id,
  //     userId = req.body.authId,
  //     lang = req.headers.lang || "ar";

  //   if (!(await ProductModule.getById(productId))) {
  //     let errMsg = lang == "en" ? "Product not found" : "المنتج غير موجود";
  //     return next(boom.notFound(errMsg));
  //   }
  //   let user = await ClientModule.toggleProductInFavs(userId, productId);
  //   if (!user) {
  //     let errMsg = lang == "en" ? "user not found" : "المستخدم غير موجود";
  //     return next(boom.notFound(errMsg));
  //   }
  //   let favProducts = user.favProducts;
  //   let favArray = [];
  //   favProducts.map((favPro) => {
  //     let obj = {
  //       id: favPro,
  //     };
  //     favArray.push(obj);
  //   });
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: favArray,
  //     error: null,
  //   });
  // },

  // async asyncFavProducts(req, res, next) {
  //   let products = req.body.products;
  //   let id = req.body.authId;

  //   let user = await ClientModule.getById(id);
  //   if (!user) {
  //     let errMsg = lang == "en" ? "user not found" : "المستخدم غير موجود";
  //     return next(boom.notFound(errMsg));
  //   }

  //   user.favProducts = user.favProducts.concat(products);
  //   for (let i = 0; i < user.favProducts.length; i++) {
  //     console.log(typeof user.favProducts[i]);
  //     user.favProducts[i] = user.favProducts[i] + "";
  //   }
  //   user.favProducts = Array.from(new Set(user.favProducts));
  //   user = await user.save();
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: user.favProducts,
  //     error: null,
  //   });
  // },

  // async updateFavCoupons(req, res, next) {
  //   let couponId = req.params.id,
  //     userId = req.body.authId,
  //     lang = req.headers.lang || "ar";

  //   if (!(await CouponModule.getById(couponId))) {
  //     let errMsg = lang == "en" ? "Coupon not found" : "الكوبون غير موجود";
  //     return next(boom.notFound(errMsg));
  //   }
  //   let user = await ClientModule.toggleCouponInFavs(userId, couponId);
  //   if (!user) {
  //     let errMsg = lang == "en" ? "user not found" : "المستخدم غير موجود";
  //     return next(boom.notFound(errMsg));
  //   }
  //   let favCoupons = user.favCoupons;

  //   let favArray = [];
  //   favCoupons.map((favCop) => {
  //     let obj = {
  //       id: favCop,
  //     };
  //     favArray.push(obj);
  //   });
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: favArray,
  //     error: null,
  //   });
  // },

  // async getFavCoupons(req, res, next) {
  //   let userId = req.body.authId;
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: await ClientModule.getFavCoupons(userId),
  //     error: null,
  //   });
  // },

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

  // async changePassword(req, res, next) {
  //   let id = req.body.authId;
  //   delete req.body.authId;
  //   let currentPssword = req.body.currentPassword,
  //     newPssword = req.body.newPassword;
  //   let user = await ClientModule.getById(id);
  //   if (!user) {
  //     return next(boom.notFound(errMsg));
  //   }

  //   if (!(await bcryptCheckPass(currentPssword, user.password))) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "Wrong Password!" : "الباسورد غير صحيح";
  //     return next(boom.badData(errMsg));
  //   }

  //   let hashedPass = await hashPass(newPssword);
  //   let changePassword = await ClientModule.changePassword(id, hashedPass);
  //   changePassword = changePassword.toObject();
  //   delete changePassword.password;
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: changePassword,
  //     error: null,
  //   });
  // },

  // async updateProfile(req, res, next) {
  //   let id = req.body.authId;
  //   delete req.body.authId;
  //   let newData = req.body;
  //   let lang = req.headers.lang || "ar",
  //     errMsg = lang == "en" ? "Error" : "Error";
  //   let smsToken = "";
  //   if (req.file) {
  //     let imgURL =
  //       "http://api.bazar.alefsoftware.com/api/v1/customers-management/user-image/" +
  //       req.file.filename;
  //     newData.imgURL = imgURL;
  //   }
  //   if (req.body.mobile) {
  //     if (!req.body.countryCode) {
  //       let errMsg =
  //         lang == "en" ? "Country Code must be send" : "يجب ادخال كود الدولة";
  //       return next(boom.badData(errMsg));
  //     }
  //     req.body.isVerified = false;
  //     smsToken = getSMSToken(5);
  //     let addToVerificationRes = await VerificationsModule.add(
  //       id,
  //       smsToken,
  //       req.body.countryCode,
  //       req.body.mobile
  //     );
  //     if (addToVerificationRes.err) return next(boom.badData(errMsg));
  //     let smsMessage =
  //       req.headers.lang == "en"
  //         ? "Bazaar app : welcome to bazaar your verification code is "
  //         : "تطبيق بازار : مرحبا بك في تطبيق بازار الرمز التاكيدي لحسابك هو ";
  //     // smsToken = await Messages.sendMessage(
  //     //   req.body.countryCode+req.body.mobile,
  //     //   smsMessage + smsToken
  //     // );
  //   }

  //   // console.log(newData);
  //   let update = await ClientModule.updatePrfile(id, newData);
  //   update = update.toObject();
  //   delete update.password;
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: update,
  //     smsToken,
  //     error: null,
  //   });
  // },

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

export { ClientControllers };
