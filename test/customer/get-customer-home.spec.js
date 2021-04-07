import { categoriesFactory } from "../../src/category/category.factory";
import { providersFactory } from "../../src/provider/provider.factory";
import { CUSTOMER_HOME } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("get customer home suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer home successfully", async () => {
    await providersFactory(10);
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: CUSTOMER_HOME,
    });
    expect(res.body.data.categories.docs.length).toBe(10);
    expect(res.body.data.providers.docs.length).toBe(10);
  });
});
