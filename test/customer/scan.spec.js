import { testRequest } from "../request.js";
import {
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { MARK_COUPON_USED, SCAN } from "../endpoints/customer.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("get customers subscriptions suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("get customers subscriptions successfully", async () => {
    const customer = await customerFactory();
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      { customer: customer.user },
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SCAN,
      token: customer.token,
      variables: { code: provider.code },
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

  it("error if no subscriptions", async () => {
    const customer = await customerFactory();
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SCAN,
      token: customer.token,
      variables: { code: provider.code },
    });
    expect(res.body.statusCode).toBe(640);
  });

  it("shouldn't return if coupon is used", async () => {
    const customer = await customerFactory();
    const provider = await providerFactory();
    const subscription = await providerCustomerCouponFactory(
      { provider: provider._id },
      { customer: customer.user },
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SCAN,
      token: customer.token,
      variables: { code: provider.code },
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
      method: HTTP_METHODS_ENUM.POST,
      url: SCAN,
      token: customer.token,
      variables: { code: provider.code },
    });
    expect(res2.body.statusCode).toBe(640);
  });
});
