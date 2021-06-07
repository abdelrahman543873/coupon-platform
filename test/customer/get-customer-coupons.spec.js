import { categoryFactory } from "../../src/category/category.factory";
import {
  couponFactory,
  couponsFactory,
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { providerFactory } from "../../src/provider/provider.factory";
import { GET_CUSTOMERS_COUPONS } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("get customer coupons suite case", () => {
  it("get customers coupons service", async () => {
    await couponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest`,
    });
    expect(res.body.data.docs[0].provider.name).toBeTruthy();
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(10);
  });

  it("shouldn't get the coupon if it's sold out in the newest section", async () => {
    const coupon = await couponFactory({ amount: 0 });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    });
    expect(couponResult.length).toBe(0);
  });

  it("shouldn't get the coupons if they are sold out in the best seller section", async () => {
    const coupon = await providerCustomerCouponsFactory(
      10,
      {},
      {},
      { amount: 0 }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id == decodeURI(encodeURI(coupon.coupon));
    });
    expect(couponResult.length).toBe(0);
  });

  it("get logged in customers coupons service", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {}
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&limit=1000`,
      token: customer.token,
    });
    const result = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(subscription.coupon));
    })[0];
    expect(result.isSubscribe).toBe(true);
    expect(result.provider.name).toBeTruthy();
  });

  it("get logged in customers coupons service with a rejected coupon", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {},
      { enRejectionReason: "something", arRejectionReason: "something else" }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&limit=1000`,
      token: customer.token,
    });
    const result = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(subscription.coupon));
    })[0];
    expect(result.isRejected).toBe(true);
    expect(result.provider.name).toBeTruthy();
  });

  it("get logged in customers coupons service for newest", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: customer.favCoupons[0] }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest&limit=1000`,
      token: customer.token,
    });
    const coupon = res.body.data.docs.filter((coupon) => {
      return coupon._id === decodeURI(encodeURI(subscription.coupon));
    })[0];
    expect(coupon.isFav).toBe(true);
    expect(coupon.isSubscribe).toBe(true);
    expect(coupon.provider.name).toBeTruthy();
  });

  it("get logged in customers coupons service for newest where the subscription is reject", async () => {
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: customer.favCoupons[0] },
      { enRejectionReason: "something", arRejectionReason: "somethingElse" }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest&limit=1000`,
      token: customer.token,
    });
    const coupon = res.body.data.docs.filter((coupon) => {
      return coupon._id === decodeURI(encodeURI(subscription.coupon));
    })[0];
    expect(coupon.isRejected).toBe(true);
    expect(coupon.isFav).toBe(true);
    expect(coupon.isSubscribe).toBe(false);
    expect(coupon.provider.name).toBeTruthy();
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

  it("shouldn't get coupons by newest for inactive providers", async () => {
    const category = await categoryFactory();
    const provider = await providerFactory({ isActive: false });
    const coupon = await couponFactory({ provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    });
    expect(couponResult.length).toBe(0);
  });

  it("shouldn't get coupons by newest for unverified providers", async () => {
    const category = await categoryFactory();
    const provider = await providerFactory({ isVerified: false });
    const coupon = await couponFactory({ provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    });
    expect(couponResult.length).toBe(0);
  });

  it("error if not newest or best seller ", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=new`,
    });
    expect(res.body.statusCode).toBe(400);
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
    const result = res.body.data.docs.filter((coupon) => {
      return coupon._id === decodeURI(encodeURI(additionalCoupon.coupon));
    });
    expect(result[0].provider.name).toBeTruthy();
    expect(result.length).toBe(1);
  });

  it("shouldn't get best seller coupons if unverified", async () => {
    // increasing the number of a coupon to check most sold
    const provider = await providerFactory({ isActive: false });
    const additionalCoupon = await providerCustomerCouponFactory(
      {
        provider: provider._id,
      },
      {},
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id == additionalCoupon.coupon;
    });
    expect(couponResult.length).toBe(0);
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

  it("get logged in customers coupons favorite service for newest", async () => {
    const coupon = await couponFactory();
    const customer = await customerFactory({ favCoupons: [coupon._id] });
    await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest&limit=1000`,
      token: customer.token,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    })[0];
    expect(couponResult.isFav).toBe(true);
    expect(couponResult.isSubscribe).toBe(true);
  });

  it("subscribe and isFav evaluates to false if no user is logged in", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=newest&limit=1000`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    })[0];
    expect(couponResult.isFav).toBe(false);
    expect(couponResult.isSubscribe).toBe(false);
  });

  it("subscribe and isFav evaluates to true if user is logged in for best selling", async () => {
    const coupon = await couponFactory();
    const customer = await customerFactory({ favCoupons: [coupon._id] });
    await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&limit=1000`,
      token: customer.token,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    })[0];
    expect(couponResult.isFav).toBe(true);
    expect(couponResult.isSubscribe).toBe(true);
  });

  it("subscribe and isFav evaluates to false if no user is logged in for best selling", async () => {
    const coupon = await couponFactory();
    await providerCustomerCouponFactory({}, {}, { coupon: coupon._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&limit=1000`,
    });
    const couponResult = res.body.data.docs.filter((couponElement) => {
      return couponElement._id === decodeURI(encodeURI(coupon._id));
    })[0];
    expect(couponResult.isFav).toBe(false);
    expect(couponResult.isSubscribe).toBe(false);
  });

  it("should get all coupons if category is empty", async () => {
    const coupon = await couponFactory();
    await providerCustomerCouponFactory({}, {}, { coupon: coupon._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CUSTOMERS_COUPONS}?section=bestSeller&category=`,
    });
    expect(res.body.data.totalDocs).toBeGreaterThanOrEqual(1);
  });
});
