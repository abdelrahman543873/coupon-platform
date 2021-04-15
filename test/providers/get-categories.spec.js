import { testRequest } from "../request.js";
import { GET_CATEGORIES } from "../endpoints/provider";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { categoriesFactory } from "../../src/category/category.factory.js";
describe("get categories suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("get categories successfully", async () => {
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CATEGORIES,
    });
    expect(res.body.data.docs.length).toBe(11);
  });

  it("first item is the home item", async () => {
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CATEGORIES,
    });
    expect(res.body.data.docs[0]._id).toBe(null);
  });
});
