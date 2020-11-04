import { VerificationModel } from "../../Users/models/verification";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper";

const VerificationsModule = {
  async add(code, user, mobile) {
    return await VerificationModel({
      code,
      user,
      mobile,
    })
      .save()
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
  async get(user, code) {
    if (!checkAllMongooseId(user)) return null;

    return await VerificationModel.findOne({ user, code })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },

  async getByCode(code) {
    return await VerificationModel.findOne({ code: code })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
  async delete(user) {
    if (!checkAllMongooseId(user)) return null;

    return await VerificationModel.deleteMany({ user })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { VerificationsModule };
