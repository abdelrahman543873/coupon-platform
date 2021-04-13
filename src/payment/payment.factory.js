import faker from "faker";
import { paymentModel } from "./models/payment.model";
import { PaymentEnum } from "./payment.enum";

export const buildPaymentParams = (obj = {}) => {
  return {
    enName: obj.enName || faker.commerce.productName(),
    arName: obj.arName || faker.commerce.productName(),
    isActive: obj.isActive || true,
    key: obj.key || faker.random.arrayElement(PaymentEnum),
  };
};

export const paymentsFactory = async (count = 10, obj = {}) => {
  const payments = [];
  for (let i = 0; i < count; i++) {
    payments.push(buildPaymentParams(obj));
  }
  return await paymentModel.collection.insertMany(payments);
};

export const paymentFactory = async (obj = {}) => {
  const params = buildPaymentParams(obj);
  return await paymentModel.create(params);
};
