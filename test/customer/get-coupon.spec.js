import {
  couponFactory,
  providerCustomerCouponFactory,
} from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { GET_COUPON } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("get coupon suite case", () => {
  it("get coupon successfully", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_COUPON}?coupon=${coupon._id}`,
    });
    expect(res.body.data._id).toBe(decodeURI(encodeURI(coupon._id)));
  });

  it("isSubscribe and is Fav false when no user", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_COUPON}?coupon=${coupon._id}`,
    });
    expect(res.body.data.isSubscribe).toBe(false);
    expect(res.body.data.isFav).toBe(false);
  });

  it("isSubscribe and isFav true when user is subscribed and favorite a coupon", async () => {
    const coupon = await couponFactory();
    const customer = await customerFactory({ favCoupons: [coupon._id] });
    await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_COUPON}?coupon=${coupon._id}`,
      token: customer.token,
    });
    expect(res.body.data.isSubscribe).toBe(true);
    expect(res.body.data.isFav).toBe(true);
  });
});
