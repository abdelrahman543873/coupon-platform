import { checkAllMongooseId } from "../../utils/mongooseIdHelper";
import { ClientModel } from "../models/client";

const ClientModule = {
  async getById(id) {
    if (!checkAllMongooseId(id)) return null;

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

  async getByEmail(email) {
    return await ClientModel.findOne({ email });
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

  async add(name, mobile, countryCode, password, imgURL) {
    return await new ClientModel({
      name,
      mobile,
      countryCode,
      password,
      imgURL,
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

  async addViaSocialMedia(client) {
    client.isSocialMediaVerified = true;
    client.isVerified = true;
    console.log(client);
    return await new ClientModel({ ...client })
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
    if (!checkAllMongooseId(id)) return null;

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
    if (!checkAllMongooseId(userId)) return null;
    if (!checkAllMongooseId(couponId)) return null;
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
    if (!checkAllMongooseId(userId)) return null;

    let user = await this.getById(userId);
    if (!user) return null;
    //user = await user.populate("favCoupons").execPopulate();
    return user.favCoupons;
  },
};
export { ClientModule };
