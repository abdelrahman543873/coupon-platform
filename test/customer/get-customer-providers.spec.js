import { GET_CUSTOMER_PROVIDERS } from "../endpoints/customer.js";
import { providersFactory } from "../../src/provider/provider.factory.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
describe("get customer providers suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("should get providers", async () => {
    await providersFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_PROVIDERS,
    });
    expect(res.body.data.docs.length).toBe(10);
  });

  it("shouldn't get providers if inactive", async () => {
    await providersFactory(10, { isActive: false });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_PROVIDERS,
    });
    expect(res.body.data.docs.length).toBe(0);
  });

  it("shouldn't get providers if not verified", async () => {
    await providersFactory(10, { isVerified: false });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CUSTOMER_PROVIDERS,
    });
    expect(res.body.data.docs.length).toBe(0);
  });
});
