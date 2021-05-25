import { testRequest } from "../request.js";
import { GET_PROVIDER_HOME } from "../endpoints/provider.js";
import { rollbackDbForCoupon } from "./rollback-for-coupon.js";
import {
  couponsFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get provider home suite case", () => {
  afterEach(async () => {
    await rollbackDbForCoupon();
  });

  it("should get the correct amount of sold coupons", async () => {
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      {},
      { provider: provider._id, amount: 10 }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER_HOME,
      token: provider.token,
    });
    expect(res.body.data.numberOfSoldCoupons).toBe(10);
    expect(res.body.data.numberOfCoupons).toBe(100);
    expect(res.body.data.remainingCoupons).toBe(90);
  });

  it("should get 0 if provider doesn't have coupons", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER_HOME,
      token: provider.token,
    });
    expect(res.body.data.numberOfCoupons).toBe(0);
    expect(res.body.data.remainingCoupons).toBe(0);
  });

  it("shouldn't get negative", async () => {
    const provider = await providerFactory();
    const coupons = await couponsFactory(10, {
      provider: provider._id,
      amount: 10,
    });
    for (let i = 0; i < coupons.ops.length; i++) {
      await providerCustomerCouponsFactory(
        2,
        { provider: provider._id },
        {},
        { coupon: coupons.ops[i]._id }
      );
    }
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER_HOME,
      token: provider.token,
    });
    expect(res.body.data.numberOfSoldCoupons).toBe(20);
    expect(res.body.data.numberOfCoupons).toBe(100);
    expect(res.body.data.remainingCoupons).toBe(80);
  });
});
