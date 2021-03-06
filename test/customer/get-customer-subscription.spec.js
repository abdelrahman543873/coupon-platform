import { testRequest } from "../request.js";
import { providerCustomerCouponFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import {
  GET_CUSTOMER_SUBSCRIPTION,
  MARK_COUPON_USED,
} from "../endpoints/customer.js";

describe("get customer subscription suite case", () => {
  it("get customer subscription successfully", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: customer.favCoupons[0] }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: customer.token,
    });
    expect(res.body.data.coupon.isFav).toBe(true);
    expect(res.body.data.coupon.isSubscribe).toBe(true);
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data._id).toBe(decodeURI(encodeURI(subscription._id)));
  });

  it("get arabic lang error", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: customer.favCoupons[0] }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?coupon=something`,
      token: customer.token,
    });
    expect(res.body.statusCode).toBe(631);
  });

  it("get customer subscription successfully which is rejected", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: customer.favCoupons[0] },
      { enRejectionReason: "something", arRejectionReason: "something" }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: customer.token,
    });
    expect(res.body.data.coupon.isFav).toBe(true);
    expect(res.body.data.coupon.isRejected).toBe(true);
    expect(res.body.data.coupon.isSubscribe).toBe(false);
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data._id).toBe(decodeURI(encodeURI(subscription._id)));
  });

  it("shouldn't duplicate value", async () => {
    const customer = await customerFactory();
    const customer1 = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: customer.favCoupons[0] }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: customer.token,
    });
    expect(res.body.data.coupon.isFav).toBe(true);
    expect(res.body.data.coupon.isSubscribe).toBe(true);
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data._id).toBe(decodeURI(encodeURI(subscription._id)));
  });

  it("get customer subscription successfully with no fav and isSubscribe", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: customer.token,
    });
    expect(res.body.data.coupon.isFav).toBe(false);
    expect(res.body.data.coupon.isSubscribe).toBe(true);
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
  });

  it("get customer subscription successfully with no fav and no subscribe", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: customer.token,
    });
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { subscription: subscription._id },
      token: customer.token,
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMER_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: customer.token,
    });
    expect(res1.body.data.coupon.isFav).toBe(false);
    expect(res1.body.data.coupon.isSubscribe).toBe(false);
    expect(res1.body.data.coupon._id).toBeTruthy();
    expect(res1.body.data.customer._id).toBeTruthy();
    expect(res1.body.data.paymentType._id).toBeTruthy();
    expect(res1.body.data.coupon.provider._id).toBeTruthy();
  });
});
