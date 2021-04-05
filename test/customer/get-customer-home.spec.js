import {
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { CUSTOMER_HOME } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("get customer home suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer register", async () => {
    const customer = await customerFactory();
    const providerCustomerCoupons = await providerCustomerCouponsFactory();
    // increasing the number of a coupon to check most sold
    await providerCustomerCouponFactory(
      {
        provider: providerCustomerCoupons.ops[0].provider,
      },
      { customer: providerCustomerCoupons.ops[0].customer },
      { coupon: providerCustomerCoupons.ops[0].coupon }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: CUSTOMER_HOME,
      token: customer.token,
    });
    console.log(res.body.data);
    // expect(res.body.data.mostSoldCoupons[0].coupon[0]._id).toBe(
    //   decodeURI(encodeURI(providerCustomerCoupons.ops[0].coupon))
    // );
  });
});
