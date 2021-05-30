import { categoryFactory } from "../../src/category/category.factory";
import {
  couponFactory,
  couponsFactory,
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory";
import { CouponModel } from "../../src/coupon/models/coupon.model";
import { customerFactory } from "../../src/customer/customer.factory";
import { userFactory } from "../../src/user/user.factory";
import { SEARCH } from "../endpoints/search";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("search coupon suite case", () => {
  it("should search for exact word ", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}&offset=0&limit=500`,
    });
    const result = res.body.data.docs.filter((couponElement) => {
      return couponElement.enName === coupon.enName;
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(result.length).toBe(1);
  });

  it("should search and return isSubscribe and isFav correctly for logged in user", async () => {
    const coupon = await couponFactory();
    const customer = await customerFactory({ favCoupons: [coupon._id] });
    await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}`,
      token: customer.token,
    });
    expect(res.body.data.docs[0].isFav).toBe(true);
    expect(res.body.data.docs[0].isSubscribe).toBe(true);
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should search and return isSubscribe and isFav false for non logged in user", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}`,
    });
    expect(res.body.data.docs[0].isFav).toBe(false);
    expect(res.body.data.docs[0].isSubscribe).toBe(false);
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0].enName).toBe(coupon.enName);
  });

  it("should work for admin", async () => {
    const coupon = await couponFactory();
    const admin = await userFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH}?name=${coupon.enName}`,
      token: admin.token,
    });
    expect(res.body.data.docs[0].isFav).toBe(false);
    expect(res.body.data.docs[0].isSubscribe).toBe(false);
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
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(10);
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
