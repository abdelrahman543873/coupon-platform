import { ClientModel } from "../models/client";

const ClientModule = {
  async getById(id) {
    return await ClientModel.findById(id).catch((err) => {
      console.log(err);
      return null;
    });
  },
  async getBySocialMediaId(id) {
    return await ClientModel.findOne({ socialMediaId: id });
  },

  async getByMobile(mobile) {
    return await ClientModel.findOne({ mobile });
  },

  async getByMobileNotVerified(mobile) {
    return await ClientModel.findOne({ mobile, isVerified: false })
      .then((doc) => {
        return { doc, err: null };
      })
      .catch((err) => {
        return { doc: null, err };
      });
  },

  async add(name, mobile, countryCode, password) {
    return await new ClientModel({
      name,
      mobile,
      countryCode,
      password,
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

  async addViaSocialMedia({
    name,
    socialMediaId,
    socialMediaType,
    mobile,
    countryCode,
  }) {
    return await new ClientModel({
      name,
      socialMediaId,
      socialMediaType,
      mobile,
      countryCode,
      isSocialMediaVerified: true,
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

  async verify(id) {
    let user = await this.getById(id);
    user.isVerified = true;
    return await user.save();
  },

  async fillSocialMediaData(user, socialMediaId, socialMediaType) {
    user.socialMediaId = socialMediaId;
    user.socialMediaType = socialMediaType;
    return await user.save().catch((err) => {
      console.log(err);
      return null;
    });
  },

  async toggleCouponInFavs(userId, couponId) {
    let user = await this.getById(userId);
    if (!user) return null;
    if (!user.favCoupons) {
      user.favCoupons = [couponId];
      user = await user.save();
      return user;
    }

    let coupontIndex = user.favCoupons.indexOf(couponId);
    if (coupontIndex < 0) {
      user.favCoupons.push(couponId);
    } else {
      user.favCoupons.splice(coupontIndex, 1);
    }
    user = await user.save();
    return user;
  },

  async getFavCoupons(userId) {
    let user = await this.getById(userId);
    if (!user || !user.favCoupons) return [];
    user = await user.populate("favCoupons").execPopulate();
    return user.favCoupons;
  },

  async updatePrfile(id, clientData) {
    return await ClientModel.findByIdAndUpdate(
      id,
      { $set: { ...clientData } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },

  async changePassword(id, newPassword) {
    return await ClientModel.findByIdAndUpdate(
      id,
      { $set: { password: newPassword } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },
};
export { ClientModule };
