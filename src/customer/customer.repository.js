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
