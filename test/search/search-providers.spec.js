import { SEARCH_PROVIDERS } from "../endpoints/search";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("search providers suite case", () => {
  it("should search for exact word ", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=${provider.name}&limit=500`,
    });
    const result = res.body.data.docs.filter((providerElement) => {
      return providerElement.name === provider.name;
    });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("should search for a letter ", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=${provider.name[0]}&limit=500`,
    });
    const result = res.body.data.docs.filter((providerElement) => {
      return providerElement.name === provider.name;
    });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("shouldn't return if string doesn't match", async () => {
    const provider = await providerFactory({
      name: "something",
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=123456789`,
    });
    expect(res.body.data.docs.length).toBe(0);
  });
});
