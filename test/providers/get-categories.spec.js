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
    const category = await categoryFactory();
    await couponsFactory(10, { category: category._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CATEGORIES}?offset=0&limit=200`,
    });
    const result = res.body.data.docs.filter((categoryElement) => {
      return categoryElement._id === decodeURI(encodeURI(category._id));
    })[0];
    expect(result.couponsCount).toBe(10);
  });

  it("should get number of category coupons with offset", async () => {
    const category = await categoryFactory();
    await couponsFactory(10, { category: category._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CATEGORIES}?offset=0&limit=200`,
    });
    const categoryResult = res.body.data.docs.filter((categoryElement) => {
      return categoryElement._id === decodeURI(encodeURI(category._id));
    })[0];
    expect(categoryResult.couponsCount).toBe(10);
  });

  it("first item is the home item", async () => {
    await categoriesFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CATEGORIES}?offset=0&limit=200`,
    });
    expect(res.body.data.docs[0]._id).toBe("");
  });
});
