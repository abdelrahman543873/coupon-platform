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
  async getByEmail(email) {
    return await ClientModel.findOne({ email });
  },
  async getByUsername(username) {
    return await ClientModel.findOne({ username });
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
  async add({ username, email, password, imgURL }) {
    return await new ClientModel({
      username,
      email,
      password,
      imgURL,
      isVerified: false,
      isSocialMediaVerified: false,
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
    username,
    email,
    imgURL,
    socialMediaId,
    socialMediaType,
  }) {
    return await new ClientModel({
      username,
      email,
      imgURL,
      socialMediaId,
      socialMediaType,
      isVerified: false,
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
  async addMobile(id, countryCode, mobile) {
    return await ClientModel.findByIdAndUpdate(
      id,
      { countryCode, mobile },
      { new: true }
    )
      .then((doc) => {
        return { doc, err: null };
      })
      .catch((err) => {
        return { doc: null, err };
      });
  },
  async verify(id) {
    let user = await this.getById(id);
    user.isVerified = true;
    return await user.save();
  },
  async fillSocialMediaData(user, socialMediaId, socialMediaType, imgURL) {
    user.socialMediaId = socialMediaId;
    user.socialMediaType = socialMediaType;
    user.imgURL = imgURL;
    return await user.save().catch((err) => {
      console.log(err);
      return null;
    });
  },
  async toggleProductInFavs(userId, productId) {
    let user = await this.getById(userId);
    if (!user) return null;
    if (!user.favProducts) {
      user.favProducts = [productId];
      user = await user.save();
      return await user;
    }

    let productIndex = user.favProducts.indexOf(productId);
    if (productIndex < 0) {
      user.favProducts.push(productId);
    } else {
      user.favProducts.splice(productIndex, 1);
    }
    user = await user.save();

    let userArray = [];
    console.log(user);
    return await user;
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
    user = await user.populate("favCoupons").execPopulate();
    return user;
  },
  async getFavProducts(userId) {
    let user = await this.getById(userId);
    if (!user || !user.favProducts) return [];
    user = await user.populate("favProducts").execPopulate();
    user = await user
      .populate("favProducts.bazar", "name logoURL")
      .execPopulate();
    let fav = user.favProducts;
    fav = fav.map((favPro) => {
      favPro = favPro.toObject();
      favPro.isFav = true;
      return favPro;
    });
    return fav;
  },
  async getFavCoupons(userId) {
    let user = await this.getById(userId);
    if (!user || !user.favCoupons) return [];
    user = await user.populate("favCoupons").execPopulate();
    return user.favCoupons;
  },

  async updatePrfile(id, clientData) {
    if (clientData.deleteImg) {
      clientData.imgURL = "";
      delete clientData.deleteImg;
    }
    console.log(clientData);
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
    console.log(id);
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
