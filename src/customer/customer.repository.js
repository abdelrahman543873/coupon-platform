import { CustomerModel } from "./models/customer.model.js";
import dotenv from "dotenv";
import { CouponModel } from "../coupon/models/coupon.model.js";

dotenv.config();
export const CustomerRegisterRepository = async (customer) => {
  return await CustomerModel.create({
    ...customer,
    ...(customer.profilePictureURL &&
      customer.profilePictureURL.path && {
        profilePictureURL:
          process.env.SERVER_IP + customer.profilePictureURL.path,
      }),
  });
};

export const rawDeleteCustomer = async () => {
  return await CustomerModel.deleteMany({});
};

export const getCustomerRepository = async (user) => {
  return await CustomerModel.findOne({ user }, { _id: 0 }, { lean: true });
};

export const getCustomerFavCoupons = async (user) => {
  return await CustomerModel.findOne(
    { user },
    { _id: 0, favCoupons: 1 },
    {
      lean: true,
      populate: [
        {
          path: "favCoupons",
          populate: { path: "category provider", select: { password: 0 } },
        },
      ],
    }
  );
};

export const addFavCouponRepository = async ({ user, couponId }) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    { $addToSet: { favCoupons: couponId } },
    { new: true }
  );
};

export const addFavCouponsRepository = async ({ user, coupons }) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    { $addToSet: { favCoupons: { $each: coupons } } },
    { new: true }
  );
};

export const updateCustomerRepository = async (user, customerData) => {
  return await CustomerModel.findOneAndUpdate(
    { user },
    {
      ...customerData,
      ...(customerData.profilePictureURL && {
        profilePictureURL:
          process.env.SERVER_IP + customerData.profilePictureURL.path,
      }),
    },
    { new: true, omitUndefined: true, lean: true }
  );
};

export const getCustomerBySocialLoginRepository = async (socialMediaId) => {
  return await CustomerModel.findOne(
    { socialMediaId },
    {},
    { populate: [{ path: "user", select: { password: 0 } }], lean: true }
  );
};
