import { couponFactory } from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { ADD_FAV_COUPON } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("add fav coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("add fav coupon successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    expect(res.body.data.favCoupons.length).toBe(2);
  });
});
