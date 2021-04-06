import { CustomerModel } from "./models/customer.model.js";

export const CustomerRegisterRepository = async (customer) => {
  return await CustomerModel.create({
    ...customer,
    ...(customer.profilePictureURL && {
      profilePictureURL: customer.profilePictureURL.path,
    }),
  });
};

export const rawDeleteCustomer = async () => {
  return await CustomerModel.deleteMany({});
};

export const getCustomerRepository = async (user) => {
  return await CustomerModel.findOne(
    { user },
    { _id: 0 },
    { lean: true }
  ).populate("user");
};

export const getCustomerBySocialLoginRepository = async (socialMediaId) => {
  return await CustomerModel.findOne({ socialMediaId }).populate("user");
};
