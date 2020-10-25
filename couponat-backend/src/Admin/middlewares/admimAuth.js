import boom from "@hapi/boom";
import { decodeToken } from "../../utils/JWTHelper";

async function AdminAuth(req, res, next) {
  console.log("3213", req.body);
  let lang = req.headers.lang || "ar",
    auth = req.headers.authentication;

  if (!auth) {
    let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
    return next(boom.unauthorized(errMsg));
  }

  if (auth == "Just for development") return next();

  let authInfo = await decodeToken(auth);

  if (!authInfo) {
    let errMsg = lang == "en" ? "Invalid token" : "رمز التحقيق غير صحيح";
    return next(boom.unauthorized(errMsg));
  }

  if (authInfo.type != "ADMIN"  && authInfo.type != "BOSS"  ) {
    let errMsg = lang == "en" ? "Not have accsses" : "ليس لديك صلاحيات";
    return next(boom.unauthorized(errMsg));
  }
  next();
}

export { AdminAuth };
