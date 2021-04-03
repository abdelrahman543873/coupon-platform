import { get, testRequest } from "../request.js";
import { GET_PROVIDER_HOME } from "../endpoints/provider.js";
import { rollbackDbForCoupon } from "./rollback-for-coupon.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get provider home suite case", () => {
  afterEach(async () => {
    await rollbackDbForCoupon();
  });
  it("get provider home successfully", async () => {
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { providerId: provider._id },
      {},
      { providerId: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER_HOME,
      token: provider.token,
    });
    expect(res.body.data.numberOfSoldCoupons).toBe(10);
    expect(res.body.data.numberOfCoupons).toBe(10);
    expect(res.body.data.remainingCoupons).toBe(0);
  });
});
