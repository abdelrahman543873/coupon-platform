import { testRequest } from "../request.js";
import {
  buildProviderCustomerCouponParams,
  couponFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
import { SUBSCRIBE } from "../endpoints/customer.js";
import { paymentFactory } from "../../src/payment/payment.factory.js";
import { PaymentEnum } from "../../src/payment/payment.enum.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import path from "path";
import { getCoupon } from "../../src/coupon/coupon.repository.js";
describe("subscribe suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("should subscribe with cash successfully", async () => {
    const customer = await customerFactory();
    const params = await buildProviderCustomerCouponParams();
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
      },
    });
    expect(res.body.data.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
  });

  it("should decrease the amount of coupon sold successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const params = await buildProviderCustomerCouponParams(
      {},
      {},
      { coupon: coupon.id }
    );
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
      },
    });
    const afterSubscription = (await getCoupon({ _id: coupon.id })).amount;
    expect(res.body.data.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(afterSubscription).toBe(coupon.amount - 1);
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
  });
  it("should throw error when coupon is sold", async () => {
    const customer = await customerFactory();
    const params = await buildProviderCustomerCouponParams(
      {},
      {},
      { amount: 0 }
    );
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
      },
    });
    expect(res.body.statusCode).toBe(636);
  });

  it("should subscribe with bank transfer successfully", async () => {
    const customer = await customerFactory();
    const params = await buildProviderCustomerCouponParams();
    const paymentType = await paymentFactory({ key: PaymentEnum[1] });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        account: customer.id,
        transactionId: "1234",
      },
      fileParam: "image",
      filePath,
    });
    expect(res.body.data.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
    expect(res.body.data.image).toContain(".jpg");
  });

  it("should subscribe with online payment successfully", async () => {
    const customer = await customerFactory();
    const params = await buildProviderCustomerCouponParams();
    const paymentType = await paymentFactory({ key: PaymentEnum[0] });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        account: customer.id,
        transactionId: "1234",
      },
      fileParam: "image",
      filePath,
    });
    expect(res.body.data.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
    expect(res.body.data.image).toContain(".jpg");
  });
});
