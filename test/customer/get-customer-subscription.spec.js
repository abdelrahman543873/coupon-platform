import { testRequest } from "../request.js";
import { GET_SUBSCRIPTION } from "../endpoints/provider.js";
import {
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { GET_CUSTOMER_SUBSCRIPTION } from "../endpoints/customer.js";

describe("get customer subscription suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
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
});
