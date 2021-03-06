import { testRequest } from "../request.js";
import { GET_SUBSCRIPTION } from "../endpoints/provider.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get subscription suite case", () => {
  it("get subscription successfully", async () => {
    const provider = await providerFactory();
    const subscriptions = await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      {},
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_SUBSCRIPTION}?subscription=${subscriptions.ops[0]._id}`,
      token: provider.token,
    });
    expect(res.body.data.coupon.subCount).toBe(1);
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data._id).toBe(
      decodeURI(encodeURI(subscriptions.ops[0]._id))
    );
  });

  it("should throw error if subscription doesn't exist", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_SUBSCRIPTION}?subscription=${provider._id}`,
      token: provider.token,
    });
    expect(res.body.statusCode).toBe(619);
  });
});
