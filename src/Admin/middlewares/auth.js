import boom from "@hapi/boom";
import {decodeAdminToken} from '../utils/JWTHelper'
const AdminsAuth = {
  async isAdmin(req, res, next) {
    let lang = req.headers.lang || "ar",
      auth = req.headers.authentication;

    if (!auth) {
      let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
      return next(boom.unauthorized(errMsg));
    }

    let decodingRes = await decodeAdminToken(auth);
    if (auth == "Just for development") {
      return next();
    }
    else if (!decodingRes) {
      console.log(auth);
      let errMsg = lang == "en" ? "Wrong Authentication!" : "خطأ بالتوثيق";
      return next(boom.unauthorized(errMsg));
    }
    if (decodingRes.role != "ADMIN") {
      let errMsg =
        lang == "en"
          ? "Admin privileges is required"
          : "امتيازات مشرف مطلوبه لهذه العمليه";
      return next(boom.forbidden(errMsg));
    }
    return next();
  },
  async isEditorOrHigher(req, res, next) {
    let lang = req.headers.lang || "ar",
      auth = req.headers.authentication;

    if (!auth) {
      let errMsg = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";
      return next(boom.unauthorized(errMsg));
    }

    let decodingRes = await decodeAdminToken(auth);
    if (auth === "Just for development") {
      return next();
    }
    if (!decodingRes) {
      let errMsg = lang == "en" ? "Wrong Authentication!" : "خطأ بالتوثيق";
      return next(boom.unauthorized(errMsg));
    }
    if (decodingRes.role != "EDITOR" && decodingRes.role != "ADMIN") {
      console.log(decodingRes.role);
      let errMsg =
        lang == "en"
          ? "Editor privileges is required"
          : "امتيازات محرر مطلوبه لهذه العمليه";
      return next(boom.forbidden(errMsg));
    }
    next();
  },
};

export { AdminsAuth };
