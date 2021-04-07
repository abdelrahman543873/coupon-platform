import {
  couponFactory,
  providerCustomerCouponFactory,
} from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { MARK_COUPON_USED } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("mark coupon used suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("mark coupon used successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      { coupon: coupon._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    expect(res.body.data.isUsed).toBe(true);
  });

  it("error customer isn't subscribed to this coupon", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MARK_COUPON_USED,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    expect(res.body.statusCode).toBe(623);
  });
});
