import { couponsFactory } from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { SYNC_FAV_COUPONS } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("add fav coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("add fav coupon successfully", async () => {
    const customer = await customerFactory();
    const coupons = (await couponsFactory()).ops.map((coupon) => {
      return coupon._id;
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SYNC_FAV_COUPONS,
      variables: { coupons },
      token: customer.token,
    });
    expect(res.body.data.length).toBe(11);
  });
});
