import boom from "@hapi/boom";
import { decodeProviderToken } from "../utils/JWTHelper";
import { ProviderModule } from "../modules/provider";

async function isIdAuthMathces(req, res, next) {
  let paramId = req.params.id,
    lang = req.headers.lang || "ar",
    auth = req.headers.authentication,
    errMgs = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب";

  /* let provider = await ProviderModule.getById(paramId);
  if (!provider) {
    let errMsg =
      req.headers.lang == "en" ? "Provider not found" : "المستخدم غير موجود";
    return next(boom.notFound(errMsg));
  }
  if(provider.isActive===false){
    let errMsg =
      req.headers.lang == "en" ? "this account not active" : "هذا الحساب غير مفعل";
    return next(boom.unauthorized(errMsg));
  }

  if(provider.bazar && provider.bazar.isBazarAccepted===false){
    let errMsg =
      req.headers.lang == "en" ? "waiting admin approval for the business" : "في انتظار تفعيل الادمن للمحل";
    return next(boom.unauthorized(errMsg));
  } */

  if (!auth) return next(boom.unauthorized(errMgs));

  let authId = await decodeProviderToken(auth);
  if (!authId) return next(boom.unauthorized(errMgs));
  //if (authId.id !== paramId) return next(boom.unauthorized(errMgs));

  next();
}

export { isIdAuthMathces }
