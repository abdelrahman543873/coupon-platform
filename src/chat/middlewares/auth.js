import boom from "@hapi/boom";
import { decodeToken } from "../../utils/JWTHelper";


/*
    This function check authentication for customers,
    if true, its add authId exist in the authentication token to request body

*/
async function checkUserAuth(req, res, next) {
  let lang = req.headers.lang || "ar",
    auth = req.headers.authentication;

  if (!auth) {
    let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
    return next(boom.unauthorized(errMsg));
  }

  // let authId = await decodeToken(auth);

  // if (authId!==req.query.id) {
  //   let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
  //   return next(boom.unauthorized(errMsg));
  // }
  next();
}

export { checkUserAuth }
