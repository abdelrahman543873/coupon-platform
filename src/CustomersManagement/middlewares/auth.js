import boom from "@hapi/boom";
import { decodeToken } from "../../utils/JWTHelper";


/*
    This function check authentication for customers,
    if true, its add authId exist in the authentication token to request body

*/
async function checkCustomerAuth(req, res, next) {
  console.log("3213",req.body);
  let lang = req.headers.lang || "ar",
    auth = req.headers.authentication;

  if (!auth) {
    let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
    return next(boom.unauthorized(errMsg));
  }

  let authId = await decodeToken(auth);

  if (!authId) {
    let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
    return next(boom.unauthorized(errMsg));
  }

  if (!req.body) req.body = {};
  req.body.authId = authId;
  next();
}

export { checkCustomerAuth }
