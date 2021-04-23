import { couponsFactory } from "../../src/coupon/coupon.factory";
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
    const coupons = await couponsFactory();
    const couponsId = [];
    coupons.ops.forEach((coupon) => {
      couponsId.push(coupon._id);
    });
    const customer = await customerFactory({ favCoupons: couponsId });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_FAV_COUPONS,
      token: customer.token,
    });
    expect(res.body.data[0].isFav).toBe(true);
    expect(res.body.data[0].category.enName).toBeTruthy();
    expect(res.body.data[0].provider.password).toBeFalsy();
    expect(res.body.data.length).toBe(10);
  });
});
