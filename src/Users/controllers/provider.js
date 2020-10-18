import boom from "@hapi/boom";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { ProviderModule } from "../modules/provider";
import { getErrorMessage } from "../../utils/handleDBError";
import { generateToken } from "../../utils/JWTHelper";
import { Provider } from "../../middlewares/responsHandler";
const ProviderControllers = {
  async addProvider(req, res, next) {
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
    let { doc, err } = await ProviderModule.add(provider);

    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    provider = doc.toObject();
    let authToken = generateToken(provider._id, "PROVIDER");
    provider = new Provider(provider);
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

    if (user.isActive === false) {
      errMsg =
        req.headers.lang == "en"
          ? "this account not active"
          : "هذا الحساب غير مفعل";
      return next(boom.unauthorized(errMsg));
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

  // async updatePersonal(req, res, next) {
  //   let id = req.params.id;
  //   let newData = req.body;
  //   let smsToken = "";
  //   if (req.file) {
  //     let imgURL =
  //       "http://api.bazar.alefsoftware.com/api/v1/providers-management/providers/providers-images/" +
  //       req.file.filename;
  //     newData.imgURL = imgURL;
  //   }
  //   if (req.body.phone) {
  //     if (!req.body.countryCode) {
  //       let errMsg =
  //         lang == "en" ? "Country Code must be send" : "يجب ادخال كود الدولة";
  //       return next(boom.badData(errMsg));
  //     }
  //     req.body.isPhoneVerified = false;
  //     smsToken = getSMSToken(5);
  //     let addToVerificationRes = await VerificationsModule.add(
  //       id,
  //       smsToken,
  //       req.body.countryCode,
  //       req.body.phone
  //     );
  //     if (addToVerificationRes.err)
  //       return next(
  //         boom.badData(getErrorMessage(err, req.headers.lang || "ar"))
  //       );
  //     let smsMessage =
  //       req.headers.lang == "en"
  //         ? "Bazaar app : welcome to bazaar your verification code is "
  //         : "تطبيق بازار : مرحبا بك في تطبيق بازار الرمز التاكيدي لحسابك هو ";
  //     //  smsToken = await Messages.sendMessage(
  //     //     req.body.phone,
  //     //     smsMessage + smsToken
  //     //   );
  //   }
  //   console.log(newData);
  //   let update = await ProviderModule.updateProviderPersonal(id, newData);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: update,
  //     smsToken,
  //     error: null,
  //   });
  // },

  // async changePassword(req, res, next) {
  //   let id = req.params.id,
  //     currentPssword = req.body.currentPassword,
  //     newPssword = req.body.newPassword;
  //   let user = await ProviderModule.getById(id);
  //   if (!user) {
  //     return next(boom.badData(errMsg));
  //   }

  //   if (!(await bcryptCheckPass(currentPssword, user.password))) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "Wrong Password!" : "الباسورد غير صحيح";
  //     return next(boom.badData(errMsg));
  //   }

  //   let hashedPass = await hashPass(newPssword);
  //   let changePassword = await ProviderModule.changePassword(id, hashedPass);
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: changePassword,
  //     error: null,
  //   });
  // },

  // async getProfileInfo(req, res, next) {
  //   let id = req.params.id,
  //     provider = await ProviderModule.getById(id);
  //   if (!provider) {
  //     return res.status(404).send({
  //       isSuccessed: false,
  //       data: null,
  //       error: "not found",
  //     });
  //   }
  //   provider = await provider
  //     .populate("bazar.cityId")
  //     .populate("bazar.paymentType")
  //     .populate("bazar.bankAccount")
  //     .populate("bazar.creditCard")
  //     .execPopulate();

  //   provider = provider.toObject();

  //   if (provider.bazar) {
  //     provider.bazar.districtId = provider.bazar.districtId.map((dis) => {
  //       return dis.toString();
  //     });

  //     provider.bazar.cityId.districts = provider.bazar.cityId.districts.filter(
  //       (dist) => {
  //         console.log(dist._id);
  //         console.log(provider.bazar.districtId);
  //         return provider.bazar.districtId.includes(dist._id.toString());
  //       }
  //     );

  //     delete provider.bazar.districtId;
  //   }
  //   if (!provider) {
  //     let lang = req.headers.lang || "ar",
  //       errMsg = lang == "en" ? "not found!" : "المستخدم غير موجود";
  //     return next(boom.badData(errMsg));
  //   }
  //   delete provider.password;
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: provider,
  //     error: null,
  //   });
  // },

  async getAll(req, res, next) {
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
};

export { ProviderControllers };
