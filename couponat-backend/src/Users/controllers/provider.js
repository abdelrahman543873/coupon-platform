import boom from "@hapi/boom";
import { hashPass, bcryptCheckPass } from "../../utils/bcryptHelper";
import { ProviderModule } from "../modules/provider";
import { getErrorMessage } from "../../utils/handleDBError";
import { decodeToken, generateToken } from "../../utils/JWTHelper";
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

  async updateProvider(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id;
    let newData = req.body;
    if (req.file) {
      let logoURL =
        "/providers-management/providers/providers-images/" + req.file.filename;
      newData.logoURL = logoURL;
    }
    console.log(id);
    let { doc, err } = await ProviderModule.updateProvider(id, newData);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    console.log("doc: ", doc);
    return res.status(200).send({
      isSuccessed: true,
      data: new Provider(doc),
      error: null,
    });
  },

  async changePassword(req, res, next) {
    let auth = await decodeToken(req.headers.authentication);
    let id = auth.id,
      currentPssword = req.body.currentPassword,
      newPssword = req.body.newPassword;
    let user = await ProviderModule.getById(id);
    if (!user) {
      return next(boom.badData(errMsg));
    }

    if (!(await bcryptCheckPass(currentPssword, user.password))) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "Wrong Password!" : "الباسورد غير صحيح";
      return next(boom.badData(errMsg));
    }

    let hashedPass = await hashPass(newPssword);
    let { doc, err } = await ProviderModule.changePassword(id, hashedPass);
    if (err)
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    return res.status(200).send({
      isSuccessed: true,
      data: new Provider(doc),
      error: null,
    });
  },

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
