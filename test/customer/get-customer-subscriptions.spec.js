import { testRequest } from "../request.js";
import {
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import {
  GET_CUSTOMER_SUBSCRIPTIONS,
  MARK_COUPON_USED,
} from "../endpoints/customer.js";
describe("get customers subscriptions suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("get customers subscriptions successfully", async () => {
    const customer = await customerFactory();
    await providerCustomerCouponsFactory(
      10,
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_SUBSCRIPTIONS,
      token: customer.token,
    });
    const subscribed = res.body.data.docs.filter((subscription) => {
      return subscription.coupon.isSubscribe === true;
    });
    expect(subscribed.length).toBe(10);
    expect(res.body.data.docs[0].coupon._id).toBeTruthy();
    expect(res.body.data.docs[0].customer._id).toBeTruthy();
    expect(res.body.data.docs[0].paymentType._id).toBeTruthy();
    expect(res.body.data.docs[0].coupon.provider._id).toBeTruthy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("isSubscribe should evaluate to false when isUsed is true", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_SUBSCRIPTIONS,
      token: customer.token,
    });
    expect(res.body.data.docs[0].coupon.isSubscribe).toBe(true);
    expect(res.body.data.docs[0].coupon._id).toBeTruthy();
    expect(res.body.data.docs[0].customer._id).toBeTruthy();
    expect(res.body.data.docs[0].paymentType._id).toBeTruthy();
    expect(res.body.data.docs[0].coupon.provider._id).toBeTruthy();
    expect(res.body.data.docs.length).toBe(1);
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { coupon: subscription.coupon },
      token: customer.token,
    });
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_SUBSCRIPTIONS,
      token: customer.token,
    });
    expect(res2.body.data.docs[0].coupon.isSubscribe).toBe(false);
  });

  it("isSubscribe should evaluate to false when isUsed is true", async () => {
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_SUBSCRIPTIONS,
      token: customer.token,
    });
    expect(res.body.data.docs.length).toBe(0);
  });
});
