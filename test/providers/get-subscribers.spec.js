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
      { provider: provider.user },
      {},
      { provider: provider.user }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_SUBSCRIBERS,
      token: provider.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
