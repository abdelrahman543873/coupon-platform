import boom from "@hapi/boom";
import { decodeToken } from "../../utils/JWTHelper.js";
import { AdminModule } from "../modules/admin.js";

async function AdminAuth(req, res, next) {
  let lang = req.headers.lang || "ar",
    auth = req.headers.authentication;

  if (!auth) {
    let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
    return next(boom.unauthorized(errMsg));
  }

  let authInfo = await decodeToken(auth);

  if (!authInfo) {
    let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
    return next(boom.unauthorized(errMsg));
  }

  if (authInfo.type != "ADMIN" && authInfo.type != "BOSS") {
    let errMsg = lang == "en" ? "Not have accsses" : "ليس لديك صلاحيات";
    return next(boom.unauthorized(errMsg));
  }

  let admin = await AdminModule.getById(authInfo.id);
  if (!admin) {
    let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
    return next(boom.unauthorized(errMsg));
  }
  next();
}

async function ValidateAuth(req, res, next) {
  let lang = req.headers.lang || "ar",
    auth = req.headers.authentication;

  if (!auth) {
    let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
    return next(boom.unauthorized(errMsg));
  }
  let authInfo = await decodeToken(auth);

  if (!authInfo) {
    let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
    return next(boom.unauthorized(errMsg));
  }

  if (authInfo.type != "ADMIN" && authInfo.type != "BOSS") {
    let errMsg = lang == "en" ? "Not have accsses" : "ليس لديك صلاحيات";
    return next(boom.unauthorized(errMsg));
  }

  let admin = await AdminModule.getById(authInfo.id);
  if (!admin) {
    let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
    return next(boom.unauthorized(errMsg));
  }
  res.status(200).send({
    isSuccessed: true,
    data: true,
    error: null,
  });
}

export { AdminAuth, ValidateAuth };
