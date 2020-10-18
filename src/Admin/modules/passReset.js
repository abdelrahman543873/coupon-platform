import { PassResetModel } from "../models/passReset";

const passResetModule = {
  async saveOne(userId, code, isProvider) {
    return await PassResetModel({
      userId,
      code,
      isProvider
    })
      .save()
      .catch((err) => {
        console.log(err);
        return null;
      });
  },
  async removeOne(_id) {
    PassResetModel.deleteOne({ _id }).catch((err) => {
      console.log(err);
    });
  },
  async getByCode(code) {
    return await PassResetModel.findOne({
      code,
    }).catch((err) => {
      console.log(err);
      return null;
    });
  },
};

export { passResetModule };
