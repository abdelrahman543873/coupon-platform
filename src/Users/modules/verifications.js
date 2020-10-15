import { VerificationModel } from "../../Users/models/verification";

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
    return await VerificationModel.findOne({ user, code })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
  async delete(user) {
    return await VerificationModel.deleteMany({ user })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { VerificationsModule };
