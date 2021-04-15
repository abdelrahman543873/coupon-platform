import { CustomerModel } from "./models/customer.model.js";
import dotenv from "dotenv";

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
    { "user.password": 0 },
    { populate: "user" }
  );
};
