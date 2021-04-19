import { testRequest } from "../request.js";
import { GET_SUBSCRIPTION } from "../endpoints/provider.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
describe("get subscription suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
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
      url: GET_SUBSCRIPTION,
      token: provider.token,
      variables: { subscription: subscriptions.ops[0]._id },
    });
    expect(res.body.data.coupon._id).toBeTruthy();
    expect(res.body.data.customer._id).toBeTruthy();
    expect(res.body.data.paymentType._id).toBeTruthy();
    expect(res.body.data.coupon.provider._id).toBeTruthy();
    expect(res.body.data._id).toBe(
      decodeURI(encodeURI(subscriptions.ops[0]._id))
    );
  });
});
