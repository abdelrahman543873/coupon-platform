import { get } from "../request.js";
import { GET_MY_COUPONS } from "../endpoints/provider.js";
import { rollbackDbForCoupon } from "./rollback-for-coupon.js";
import {
  couponsFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("get my coupons suite case", () => {
  afterEach(async () => {
    await rollbackDbForCoupon();
  });
  it("get my coupons successfully", async () => {
    const provider = await providerFactory();
    await couponsFactory(10, { providerId: provider._id });
    const res = await get({
      url: GET_MY_COUPONS,
      token: provider.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get recently sold coupons", async () => {
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { providerId: provider._id },
      {},
      { providerId: provider._id }
    );
    const res = await get({
      url: `${GET_MY_COUPONS}?recentlySold=true`,
      token: provider.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
