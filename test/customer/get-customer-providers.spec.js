import { GET_CUSTOMER_PROVIDERS } from "../endpoints/customer.js";
import {
  providerFactory,
  providersFactory,
} from "../../src/provider/provider.factory.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get customer providers suite case", () => {
  it("should get providers", async () => {
    await providersFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_PROVIDERS,
    });
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(10);
  });

  it("shouldn't get provider if inactive", async () => {
    const provider = await providerFactory({ isActive: false });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_PROVIDERS,
    });
    const providerResult = res.body.data.docs.filter((providerElement) => {
      return providerElement._id === decodeURI(encodeURI(provider._id));
    });
    expect(providerResult.length).toBe(0);
  });

  it("shouldn't get provider if not verified", async () => {
    const provider = await providerFactory({ isVerified: false });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_PROVIDERS,
    });
    const providerResult = res.body.data.docs.filter((providerElement) => {
      return providerElement._id === decodeURI(encodeURI(provider._id));
    });
    expect(providerResult.length).toBe(0);
  });
});
