import { VerificationModel } from "../../Users/models/verification";

const VerificationsModule = {
  async add(userId, code, countryCode, mobile) {
    return await VerificationModel({
      userId,
      code,
      countryCode,
      mobile,
    })
      .save()
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
  async get(userId, code) {
    return await VerificationModel.findOne({ userId, code })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
  async delete(userId, code) {
    return await VerificationModel.deleteOne({ userId, code })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { VerificationsModule };
