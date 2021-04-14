import faker from "faker";
import { PaymentModel } from "./models/payment.model";
import { PaymentEnum } from "./payment.enum";

export const buildPaymentParams = (obj = {}) => {
  return {
    enName: obj.enName || faker.datatype.uuid(),
    arName: obj.arName || faker.datatype.uuid(),
    isActive: obj.isActive || true,
    key: obj.key || faker.random.arrayElement(PaymentEnum),
  };
};

export const paymentsFactory = async (count = 10, obj = {}) => {
  const payments = [];
  for (let i = 0; i < count; i++) {
    payments.push(buildPaymentParams(obj));
  }
  return await PaymentModel.collection.insertMany(payments);
};

export const paymentFactory = async (obj = {}) => {
  const params = buildPaymentParams(obj);
  return await PaymentModel.create(params);
};
