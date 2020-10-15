import { ProviderModel } from "../models/provider";

const ProviderModule = {
  async add(provider) {
    return await ProviderModel({ ...provider })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err,
        };
      });
  },

  async getById(id) {
    return await ProviderModel.findById(id);
  },

  async getByEmail(email) {
    return await ProviderModel.findOne({ email });
  },

  async getAll() {
    return ProviderModel.find({ isActive: true, isDeleted: false });
  },
  // async updateBazarID(id, bazarr) {
  //   return await ProviderModel.updateOne(
  //     { _id: id },
  //     { $set: { bazar: bazarr } }
  //   );
  // },

  // async updateProviderPersonal(id, providerData) {
  //   if (providerData.deleteImg) {
  //     providerData.imgURL = "";
  //     delete providerData.deleteImg;
  //   }
  //   return await ProviderModel.findByIdAndUpdate(
  //     id,
  //     { $set: { ...providerData } },
  //     { new: true }
  //   ).catch((err) => {
  //     console.log(err);
  //     return { err: err };
  //   });
  // },

  // async changePassword(id, newPassword) {
  //   console.log(id);
  //   return await ProviderModel.findByIdAndUpdate(
  //     id,
  //     { $set: { password: newPassword } },
  //     { new: true }
  //   ).catch((err) => {
  //     console.log(err);
  //     return { err: err };
  //   });
  // },
};

export { ProviderModule };
