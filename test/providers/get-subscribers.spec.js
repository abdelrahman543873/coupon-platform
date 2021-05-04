import { testRequest } from "../request.js";
import { GET_SUBSCRIBERS } from "../endpoints/provider.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
describe("get subscribers suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("get subscribers successfully", async () => {
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      {},
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_SUBSCRIBERS,
      token: provider.token,
    });
    expect(res.body.data.docs[0].coupon.subCount).toBe(1);
    expect(res.body.data.docs[0].coupon._id).toBeTruthy();
    expect(res.body.data.docs[0].customer._id).toBeTruthy();
    expect(res.body.data.docs[0].paymentType._id).toBeTruthy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get subscribers successfully filtered by coupons", async () => {
    const provider = await providerFactory();
    const coupons = await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      {},
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_SUBSCRIBERS}?coupon=${coupons.ops[0].coupon}`,
      token: provider.token,
    });
    expect(res.body.data.docs[0].coupon._id).toBeTruthy();
    expect(res.body.data.docs[0].customer._id).toBeTruthy();
    expect(res.body.data.docs[0].paymentType._id).toBeTruthy();
    expect(res.body.data.docs.length).toBe(1);
  });
});
