import { PaymentModel } from "./models/payment.model.js";
export const addPaymentTypeRepository = async ({ payment }) => {
  return await PaymentModel.create(payment);
};

export const getPaymentTypesRepository = async (offset = 0, limit = 15) => {
  return await PaymentModel.paginate(
    {},
    { offset: offset * limit, limit, sort: "-createdAt" }
  );
};

export const rawDeletePayments = async () => {
  return await PaymentModel.deleteMany({});
};
