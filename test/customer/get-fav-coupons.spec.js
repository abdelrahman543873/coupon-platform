import { couponFactory } from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { GET_FAV_COUPONS } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("get fav coupons suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("get fav coupons successfully", async () => {
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_FAV_COUPONS,
      token: customer.token,
    });
    expect(res.body.data.length).toBe(1);
  });
});
