import boom from "@hapi/boom";
import { AdminModule } from "../../modules/admin";
import { hashPass, bcryptCheckPass } from "../../../utils/bcryptHelper";
import { getErrorMessage } from "../../../utils/handleDBError";
import { generateAdminToken } from "../../utils/JWTHelper";
import { QuestionModule } from "../../modules/familiarQuestions";
import { AppCreditModel } from "../../models/appCridit";
import { AdsPackagesModule } from "../../modules/adsPackages";
import { AppBankModel } from "../../models/appBanks";

const AdminsController = {
  async add(req, res, next) {
    let { email, username, password, role } = req.body;
    let hashedPass = await hashPass(password);
    let { user, err } = await AdminModule.add(
      email,
      username,
      hashedPass,
      role
    );
    if (err) {
      return next(boom.badData(getErrorMessage(err, req.headers.lang || "ar")));
    }
    let admin = user.toObject();
    delete admin.password;

    return res.status(201).send({
      isSuccessed: true,
      data: {
        admin: admin,
        authToken: null,
      },
      error: null,
    });
  },
  async login(req, res, next) {
    let { email, password } = req.body,
      lang = req.headers.lang,
      admin = await AdminModule.getByEmail(email);
    if (!admin) {
      let errMsg = lang == "en" ? "Wrong email" : "البريد الاكترونى غير موجود";
      return next(boom.notFound(errMsg));
    }
    console.log(password + "  " + admin);
    if (!(await bcryptCheckPass(password, admin.password))) {
      let errMsg = lang == "en" ? "Wrong password" : "كلمة المرور غير صحيحه";
      return next(boom.badData(errMsg));
    }
    let authToken = generateAdminToken(admin._id, admin.role);

    return res.status(200).send({
      isSuccessed: true,
      data: {
        admin,
        authToken,
      },
      error: null,
    });
  },

  async addQustion(req, res, next) {
    let question = req.body;
    let addQuest = await QuestionModule.addQuestion(question);
    return res.status(200).send({
      isSuccessed: true,
      data: addQuest,
      error: null,
    });
  },

  async addPackage(req, res, next) {
    let packages = req.body;
    let addPackage = await AdsPackagesModule.addPackage(packages);
    return res.status(200).send({
      isSuccessed: true,
      data: addPackage,
      error: null,
    });
  },

  async getFamiliarQuestions(req, res, next) {
    let type = req.query.type || null;
    let questions = await QuestionModule.getQuestions(type);
    return res.status(200).send({
      isSuccessed: true,
      data: questions,
      error: null,
    });
  },

  async getPackages(req, res, next) {
    let packages = await AdsPackagesModule.getPackages(null);
    return res.status(200).send({
      isSuccessed: true,
      data: packages,
      error: null,
    });
  },

  async setPackagesOff(req, res, next) {
    let id = req.params.id;
    let packages = await AdsPackagesModule.getById(id);
    if (!packages) {
      let errMsg = lang == "en" ? "Package Not found" : "الحزمة غير موجودة";
      return next(boom.notFound(errMsg));
    }
    packages.isActive = !packages.isActive;
    packages = await packages.save();
    return res.status(200).send({
      isSuccessed: true,
      data: packages,
      error: null,
    });
  },

  async getCriditAcount(req, res, next) {
    return res.status(200).send({
      isSuccessed: true,
      data: await AppCreditModel.findOne(),
      error: null,
    });
  },

  async updateCriditAcount(req, res, next) {
    let { merchantEmail, secretKey } = req.body;
    let cridit = await AppCreditModel.findOne();
    if (!cridit) {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: "Not Found",
      });
    }
    cridit.merchantEmail = merchantEmail;
    cridit.secretKey = secretKey;
    cridit = await cridit.save().catch((err) => {
      return res.status(401).send({
        isSuccessed: false,
        data: null,
        error: err,
      });
    });

    return res.status(200).send({
      isSuccessed: true,
      data: await AppCreditModel.findOne(),
      error: null,
    });
  },

  async addBanckAccount(req, res, next) {
    let account = req.body;
    let saveAccount = await AdminModule.addBankAccount(account);
    if (saveAccount.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: saveAccount.err,
      });
    }
    return res.status(200).send({
      isSuccessed: true,
      data: saveAccount.bank,
      error: null,
    });
  },

  async toggleBankAccount(req, res, next) {
    let bankId = req.params.id;

    let bank = await AppBankModel.findById(bankId);
    bank.isActive = !bank.isActive;
    bank = await bank.save();

    return res.status(200).send({
      isSuccessed: true,
      data: bank,
      error: null,
    });
  },

  async getBanks(req, res, next) {
    let banks = await AdminModule.getBanks(null);
    return res.status(200).send({
      isSuccessed: true,
      data: banks,
      error: null,
    });
  },
};

export { AdminsController };
