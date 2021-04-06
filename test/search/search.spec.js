import { couponFactory } from "../../src/coupon/coupon.factory";
import { rollbackDbForCoupon } from "../coupon/rollback-for-coupon";
import { SEARCH } from "../endpoints/search";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("add coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForCoupon();
  });

  it("should search for exact word ", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}`,
    });
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should search for a letter ", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=a`,
    });
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("shouldn't return if string is empty", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=`,
    });
    expect(res.body.statusCode).toBe(620);
  });

  it("shouldn't return if string doesn't match", async () => {
    const coupon = await couponFactory({
      enName: "something",
      arName: "something",
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=hello`,
    });
    expect(res.body.data.docs.length).toBe(0);
  });
});
