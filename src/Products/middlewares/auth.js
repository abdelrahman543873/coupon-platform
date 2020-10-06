import boom from "@hapi/boom";
import { decodeProviderToken } from "../../ProviderManagement/utils/JWTHelper";
import { BazarModule } from "../../ProviderManagement/modules/bazar";

async function isIdAuthMathces(req, res, next) {
  let bazarId = req.body.bazar,
    lang = req.headers.lang || "ar",
    auth = req.headers.authentication,
    errMgs = lang == "en" ? "Authorization Required!" : "التوثيق مطلوب",
    bazar = await BazarModule.getById(bazarId);
    console.log(req.body);

  if (!bazar) {
    let notFoundErr = lang == "en" ? "Bazar not found" : "المحل غير موجود";
    return next(boom.badData(notFoundErr));
  }
  let prvodierId = bazar.provider;
  
  if (!auth) return next(boom.unauthorized(errMgs));

  let authId = await decodeProviderToken(auth);

  if (!authId.id) return next(boom.unauthorized(errMgs));

  next();
}

export { isIdAuthMathces };
