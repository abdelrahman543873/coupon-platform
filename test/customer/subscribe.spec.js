import { testRequest } from "../request.js";
import {
  buildCouponParams,
  buildProviderCustomerCouponParams,
  couponFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
import {
  CUSTOMER_REGISTER,
  GET_CUSTOMER_SUBSCRIPTIONS,
  MARK_COUPON_USED,
  SUBSCRIBE,
} from "../endpoints/customer.js";
import { paymentFactory } from "../../src/payment/payment.factory.js";
import { PaymentEnum } from "../../src/payment/payment.enum.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import path from "path";
import { getCoupon } from "../../src/coupon/coupon.repository.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { buildUserParams } from "../../src/user/user.factory.js";
import { ADD_COUPON } from "../endpoints/provider.js";
import { CustomerModel } from "../../src/customer/models/customer.model.js";
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
        total: params.total,
      },
    });
    expect(res.body.data.total).toBe(params.total);
    expect(res.body.data.coupon.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
  });

  it("should subscribe and get subscriptions", async () => {
    const customer = await customerFactory();
    const params = await buildProviderCustomerCouponParams();
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        total: params.total,
      },
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_SUBSCRIPTIONS,
      token: customer.token,
    });
    expect(res.body.data.docs[0].coupon._id).toBeTruthy();
    expect(res.body.data.totalDocs).toBe(1);
  });

  it("should add coupon register and subscribe and get subscriptions", async () => {
    const mockProvider = await providerFactory();
    const { provider, isActive, logoURL, code, ...variables0 } =
      await buildCouponParams();
    const res0 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_COUPON,
      token: mockProvider.token,
      variables: variables0,
    });
    const coupon = res0.body.data;
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    const { role, fcmToken, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    await CustomerModel.updateOne(
      { _id: res.body.data.user._id },
      { isVerified: true }
    );
    expect(res.body.data.authToken).toBeTruthy();
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: res.body.data.authToken,
      variables: {
        coupon: coupon._id,
        provider: coupon.provider._id,
        paymentType: paymentType.id,
        total: "55",
      },
    });
    expect(res1.body.data.coupon._id).toBeTruthy();
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_SUBSCRIPTIONS,
      token: res.body.data.authToken,
    });
    expect(res2.body.data.docs.length).toBe(1);
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
        total: params.total,
      },
    });
    const afterSubscription = (await getCoupon({ _id: coupon.id })).amount;
    expect(res.body.data.total).toBe(params.total);
    expect(res.body.data.coupon.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(afterSubscription).toBe(coupon.amount - 1);
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
  });

  it("should throw error if coupon is subscribe to and not used before", async () => {
    const customer = await customerFactory();
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider._id });
    const params = await buildProviderCustomerCouponParams(
      { provider: provider._id },
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        total: params.total,
      },
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        total: params.total,
      },
    });
    expect(res1.body.statusCode).toBe(641);
  });

  it("should be able to subscribe twice if coupon is used", async () => {
    const customer = await customerFactory();
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider._id });
    const params = await buildProviderCustomerCouponParams(
      { provider: provider._id },
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const paymentType = await paymentFactory({ key: PaymentEnum[2] });
    const res0 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        total: params.total,
      },
    });
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { subscription: res0.body.data._id },
      token: customer.token,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SUBSCRIBE,
      token: customer.token,
      variables: {
        coupon: params.coupon,
        provider: params.provider,
        paymentType: paymentType.id,
        total: params.total,
      },
    });
    expect(res.body.data.total).toBe(params.total);
    expect(res.body.data.coupon.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
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
        total: params.total,
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
        total: params.total,
      },
      fileParam: "image",
      filePath,
    });
    expect(res.body.data.total).toBe(params.total);
    expect(res.body.data.coupon.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
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
        total: params.total,
      },
      fileParam: "image",
      filePath,
    });
    expect(res.body.data.total).toBe(params.total);
    expect(res.body.data.coupon.provider.password).toBeFalsy();
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.customer._id).toBe(
      decodeURI(encodeURI(customer.user))
    );
    expect(res.body.data.image).toContain(".jpg");
  });
});
