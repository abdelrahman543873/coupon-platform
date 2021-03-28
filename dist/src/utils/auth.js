import boom from "@hapi/boom";
import { decodeToken } from "./JWTHelper.js";

async function checkUserAuth(req, res, next) {
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

  console.log(authInfo);
  next();
}

export { checkUserAuth };