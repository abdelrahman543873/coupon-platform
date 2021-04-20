import { categoryFactory } from "../../src/category/category.factory";
import {
  couponFactory,
  couponsFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory";
import { CouponModel } from "../../src/coupon/models/coupon.model";
import { customerFactory } from "../../src/customer/customer.factory";
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
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should search for exact word and return correct isSubscribe and isFav", async () => {
    const customer = await customerFactory();
    const coupons = await providerCustomerCouponsFactory(
      10,
      {},
      { customer: customer.user },
      {}
    );
    const coupon = await CouponModel.findOne({ _id: coupons.ops[0].coupon });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}`,
      token: customer.token,
    });
    expect(res.body.data.docs[0].isSubscribe).toBe(true);
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should search for exact word by category", async () => {
    const category = await categoryFactory();
    const coupon = await couponFactory({ category: category._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}&category=${category._id}`,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should search for a letter ", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=a`,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should return elements if string is empty", async () => {
    const coupon = await couponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=`,
    });
    expect(res.body.data.docs.length).toBe(10);
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
