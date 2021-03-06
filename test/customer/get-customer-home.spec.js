import { categoriesFactory } from "../../src/category/category.factory";
import { providersFactory } from "../../src/provider/provider.factory";
import { CUSTOMER_HOME } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("get customer home suite case", () => {
  it("customer home successfully", async () => {
    await providersFactory(10);
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: CUSTOMER_HOME,
    });
    expect(res.body.data.categories.docs.length).toBeGreaterThanOrEqual(10);
    expect(res.body.data.providers.docs.length).toBeGreaterThanOrEqual(10);
  });
});
