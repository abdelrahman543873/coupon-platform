import { PaymentModel } from "./models/payment.model.js";
export const addPaymentTypeRepository = async ({ payment }) => {
  return await PaymentModel.create(payment);
};
