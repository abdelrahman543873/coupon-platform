import { ProviderModel } from "../models/provider";
import { BazarModule } from "./bazar";

const ProviderModule = {
  async add(
    username,
    email,
    countryCode,
    phone,
    password,
    imgURL,
    gender,
    roles
  ) {
    return await ProviderModel({
      username,
      email,
      countryCode,
      phone,
      password,
      imgURL,
      gender,
      roles,
    })
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
    return await ProviderModel.findById(id).populate({ path: "bazar" });
  },
  async getByEmail(email) {
    return await ProviderModel.findOne({ email }).populate({ path: "bazar" });
  },
  async getByMobile(phone) {
    return await ProviderModel.findOne({ phone }).populate({ path: "bazar" });
  },
  async getByEmail(email) {
    return await ProviderModel.findOne({ email }).populate({ path: "bazar" });
  },
  async getByUsername(username) {
    return await ProviderModel.findOne({ username }).populate({
      path: "bazar",
    });
  },
  async updateBazarID(id, bazarr) {
    return await ProviderModel.updateOne(
      { _id: id },
      { $set: { bazar: bazarr } }
    );
  },
  async verifyProvider(id) {
    let provider = await this.getById(id);
    if (!provider) return null;
    provider.isPhoneVerified = true;
    return await provider.save();
  },

  async setResourceOnOff(id, bool) {
    return await ProviderModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isActive: bool },
      },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },
  async deleteResource(id) {
    return await ProviderModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isDeleted: true },
      },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },
  async getResources(bazar) {
    let bazars = await BazarModule.getById(bazar);
    bazars = await bazars
      .populate(
        "resources",
        "_id username email gender countryCode phone roles isActive imgURL",
        { isDeleted: { $ne: true } }
      )
      .execPopulate();
    bazars = bazars.toObject();

    if (!bazars) return null;
    if (bazars.resources.length !== 0) {
      bazars.resources.map((resource) => {
        delete resource.password;
      });
      return bazars.resources;
    }
    return null;
  },
  async updateProviderPersonal(id, providerData) {
    if (providerData.deleteImg) {
      providerData.imgURL = "";
      delete providerData.deleteImg;
    }
    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { ...providerData } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },
  async changePassword(id, newPassword) {
    console.log(id);
    return await ProviderModel.findByIdAndUpdate(
      id,
      { $set: { password: newPassword } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },
};

export { ProviderModule };
