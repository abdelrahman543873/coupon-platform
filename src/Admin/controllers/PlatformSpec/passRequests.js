import boom from "@hapi/boom";
import { getSMSToken } from "../../../utils/SMSToken";
import { ProviderModule } from "../../../ProviderManagement/modules/provider";
import { ClientModule } from "../../../CustomersManagement/modules/client";
import { passResetModule } from "../../modules/passReset";
import { resetPassMailer } from "../../../utils/mail/passReset";
import { hashPass } from "../../../utils/bcryptHelper";
import { Messages } from "../../../utils/twilloHelper";

const PassRequestsController = {
  async newPasswordMailRequest(req, res, next) {
    let email = req.body.email,
      isProvider = req.body.isProvider,
      lang = req.headers.lang || "ar",
      user = isProvider
        ? await ProviderModule.getByEmail(email)
        : await ClientModule.getByEmail(email);

    if (!user) {
      let errMsg =
        lang == "en" ? "Email not found!" : "البريد الالكترونى غير موجود";
      return next(boom.notFound(errMsg));
    }

    let doc = await passResetModule.saveOne(
      user._id,
      getSMSToken(5),
      isProvider
    );
    if (!doc) return next(boom.internal("Saving Password Reset process faild"));
    let maelMessage =
      lang == "en"
        ? "Enter this code to reset password: "
        : "ادخل هذا الرمز لاعادة تعين كلمة السر: ";
    resetPassMailer(user.username, maelMessage + doc.code, email);

    let msg =
      (lang == "en"
        ? "email sent to you, follow it to change your password."
        : "تم ارسال التعليمات الى بريدك الالكترونى من فضلك قم بأتباعها")+doc.code;

    res.status(201).send({
      isSuccessed: true,
      data: msg,
      error: null,
    });
  },

  async newPasswordMobileRequest(req, res, next) {
    let mobile = req.body.mobile,
      countryCode = req.body.countryCode,
      isProvider = req.body.isProvider,
      lang = req.headers.lang || "ar",
      user = isProvider
        ? await ProviderModule.getByMobile(mobile)
        : await ClientModule.getByMobile(mobile);

    if (!user) {
      let errMsg = lang == "en" ? "Phone not found!" : " الهاتف غير صحيح";
      return next(boom.notFound(errMsg));
    }

    let doc = await passResetModule.saveOne(
      user._id,
      getSMSToken(5),
      isProvider
    );
    if (!doc) return next(boom.internal("Saving Password Reset process faild"));
    let smsToken =
      (lang == "en"
        ? "Enter this code to reset password: "
        : "ادخل هذا الرمز لاعادة تعين كلمة السر  ") + doc.code;
    // smsToken = await Messages.sendMessage(countryCode+mobile, smsToken);

    res.status(201).send({
      isSuccessed: true,
      data: smsToken,
      error: null,
    });
  },

  async checkPassResettingCode(req, res, next) {
    let code = req.params.code;
    let passDoc = await passResetModule.getByCode(code);
    if (!passDoc) return next(boom.notFound("Resource not found!"));
    if (passDoc.isReseted)
      return next(boom.badRequest("This code has been used before!."));

    let nowDate = new Date();
    let diffInMilliSeconds = (nowDate - passDoc.createdAt) / 1000;
    let diffInMinuts = Math.floor(diffInMilliSeconds / 60) % 60;
    if (diffInMinuts > 2) {
      passResetModule.removeOne(passDoc._id);
      return next(
        boom.badRequest(
          req.headers.lang == "en"
            ? "This token has exceeded the verification time of 1 minut please resend it"
            : "رمز التحقيق قد تعدى الوقت المسموح به ( دقيقه واحده ) قم بأعدة ارساله"
        )
      );
    }

    res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },

  async changePassword(req, res, next) {
    let { password, code } = req.body;

    let passDoc = await passResetModule.getByCode(code);
    if (!passDoc) return next(boom.notFound("Resource not Found"));

    if (password.length < 8)
      return next(boom.badRequest("Password must be more than 7 characters"));

    let user = null;
    if (passDoc.isProvider) {
      user = await ProviderModule.getById(passDoc.userId);
      console.log(user);
    } else {
      user = await ClientModule.getById(passDoc.userId);
    }

    user.password = await hashPass(password);
    user.countryCode="+2";
    user.save();
    passResetModule.removeOne(passDoc._id);
    res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },
};

export { PassRequestsController };
