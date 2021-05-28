import {
  couponFactory,
  providerCustomerCouponFactory,
} from "../../src/coupon/coupon.factory";
import { providerCustomerCouponModel } from "../../src/subscription/models/provider-customer-coupon.model.js";
import { customerFactory } from "../../src/customer/customer.factory";
import { MARK_COUPON_USED } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("mark coupon used suite case", () => {
  it("mark coupon used successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { subscription: subscription._id },
      token: customer.token,
    });
    const subscriptionQuery = await providerCustomerCouponModel.findOne({
      coupon: coupon._id,
    });
    expect(res.body.data.provider).toBeFalsy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(subscriptionQuery.isUsed).toBe(true);
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data.coupon.category._id).toBeTruthy();
  });

  it("error customer isn't subscribed to this coupon", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { subscription: customer._id },
      token: customer.token,
    });
    expect(res.body.statusCode).toBe(642);
  });

  it("should throw error if customer has no unused coupons", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {},
      { isUsed: true }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { subscription: subscription._id },
      token: customer.token,
    });
    expect(res.body.statusCode).toBe(642);
  });
});
