import { PaymentModel } from "./models/payment.model.js";
export const addPaymentTypeRepository = async ({ payment }) => {
  return await PaymentModel.create(payment);
};

export const getPaymentTypesRepository = async (
  offset = 0,
  limit = 15,
  isActive = false
) => {
  return await PaymentModel.paginate(
    { ...(isActive && { isActive: true }) },
    { offset: offset * limit, limit, sort: "-createdAt" }
  );
};

export const updatePaymentTypeRepository = async ({ _id, paymentType }) => {
  return await PaymentModel.findOneAndUpdate({ _id }, paymentType, {
    new: true,
    lean: true,
  });
};

export const findPayment = async ({ _id }) => {
  return await PaymentModel.findOne({ _id }, {}, { lean: true });
};

export const rawDeletePayments = async () => {
  return await PaymentModel.deleteMany({});
};
