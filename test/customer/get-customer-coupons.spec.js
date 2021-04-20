import { categoryFactory } from "../../src/category/category.factory";
import {
  couponsFactory,
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { providerFactory } from "../../src/provider/provider.factory";
import { GET_CUSTOMERS_COUPONS } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("get customer coupons suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("get customers coupons service", async () => {
    await couponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest`,
    });
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get logged in customers coupons service", async () => {
    const customer = await customerFactory();
    await providerCustomerCouponsFactory(
      10,
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller`,
      token: customer.token,
    });
    expect(res.body.data.docs[0].isSubscribe).toBe(true);
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get logged in customers coupons service for newest", async () => {
    const customer = await customerFactory();
    await providerCustomerCouponsFactory(
      10,
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest`,
      token: customer.token,
    });
    const fav = res.body.data.docs.filter((coupon) => {
      return coupon._id === customer.favCoupons[0].toString();
    });
    const subscribed = res.body.data.docs.filter((coupon) => {
      return coupon.isSubscribe === true;
    });
    expect(fav.length).toBe(1);
    expect(subscribed.length).toBe(10);
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBe(11);
  });

  it("should get coupons by category filter", async () => {
    const category = await categoryFactory();
    await couponsFactory(10, { category: category._id });
    await couponsFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?category=${category._id}`,
    });
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("should get coupons by category filter and newest", async () => {
    const category = await categoryFactory();
    await couponsFactory(10, { category: category._id });
    await couponsFactory(10);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?category=${category._id}&section=newest`,
    });
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("should get coupons by provider filter and newest", async () => {
    const category = await categoryFactory();
    const provider = await providerFactory();
    await couponsFactory(12, { provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?provider=${provider._id}`,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBe(12);
  });

  it("error if not newest or best seller ", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=new`,
    });
    expect(res.body.statusCode).toBe(616);
  });

  it("customer get best seller coupons successfully", async () => {
    const providerCustomerCoupons = await providerCustomerCouponsFactory();
    // increasing the number of a coupon to check most sold
    const additionalCoupon = await providerCustomerCouponFactory(
      {
        provider: providerCustomerCoupons.ops[0].provider,
      },
      { customer: providerCustomerCoupons.ops[0].customer },
      { coupon: providerCustomerCoupons.ops[0].coupon }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller`,
    });
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0]._id).toBe(
      decodeURI(encodeURI(additionalCoupon.coupon))
    );
  });
  it("customer get best seller coupons successfully and filter by provider", async () => {
    const providerCustomerCoupons = await providerCustomerCouponsFactory();
    // increasing the number of a coupon to check most sold
    const additionalCoupon = await providerCustomerCouponFactory(
      {
        provider: providerCustomerCoupons.ops[0].provider,
      },
      { customer: providerCustomerCoupons.ops[0].customer },
      { coupon: providerCustomerCoupons.ops[0].coupon }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&provider=${additionalCoupon.provider}`,
    });
    expect(res.body.data.docs.length).toBe(1);
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0]._id).toBe(
      decodeURI(encodeURI(additionalCoupon.coupon))
    );
  });

  it("should filter by best seller and category", async () => {
    const category = await categoryFactory();
    const providerCustomerCoupons = await providerCustomerCouponsFactory(
      10,
      {},
      {},
      { category: category._id }
    );
    // increasing the number of a coupon to check most sold
    const additionalCoupon = await providerCustomerCouponFactory(
      {
        provider: providerCustomerCoupons.ops[0].provider,
      },
      { customer: providerCustomerCoupons.ops[0].customer },
      { coupon: providerCustomerCoupons.ops[0].coupon }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&category=${category._id}`,
    });
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs[0]._id).toBe(
      decodeURI(encodeURI(additionalCoupon.coupon))
    );
  });
});
