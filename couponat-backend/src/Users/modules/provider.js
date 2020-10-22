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
    return ProviderModel.find({ isActive: true, isDeleted: false }).sort(
      "-createdAt"
    );
  },

  async updateProvider(id, providerData) {
    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { ...providerData } },
      { new: true }
    )
      .then((doc) => {
        return {
          doc: doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err: err,
        };
      });
  },

  async changePassword(id, newPassword) {
    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { password: newPassword } },
      { new: true }
    )
      .then((doc) => {
        return {
          doc: doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err: err,
        };
      });
  },

  async delete(id) {
    return await ProviderModel.deleteOne({ _id: id })
      .then((doc) => ({ doc, err: null }))
      .catch((err) => ({ err, doc: null }));
  },
};

export { ProviderModule };