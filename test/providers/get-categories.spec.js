import { testRequest } from "../request.js";
import { GET_CATEGORIES } from "../endpoints/provider";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import {
  categoriesFactory,
  categoryFactory,
} from "../../src/category/category.factory.js";
import { couponsFactory } from "../../src/coupon/coupon.factory.js";
describe("get categories suite case", () => {
  it("get categories successfully", async () => {
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CATEGORIES,
    });
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(11);
  });

  it("should get category coupons count", async () => {
    const category = await categoryFactory(1);
    await couponsFactory(10, { category: category._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CATEGORIES,
    });
    expect(res.body.data.docs[1].couponsCount).toBe(10);
  });

  it("get coupons categories with offset", async () => {
    const category = await categoryFactory(1);
    await couponsFactory(10, { category: category._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CATEGORIES}?offset=0`,
    });
    expect(res.body.data.docs[1].couponsCount).toBe(10);
  });

  it("first item is the home item", async () => {
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CATEGORIES,
    });
    expect(res.body.data.docs[0]._id).toBe("");
  });
});
