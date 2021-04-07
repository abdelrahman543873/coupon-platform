import { couponFactory } from "../../src/coupon/coupon.factory";
import { GET_COUPON } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("get coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("get coupon successfully", async () => {
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_COUPON}?coupon=${coupon._id}`,
    });
    expect(res.body.data._id).toBe(decodeURI(encodeURI(coupon._id)));
  });
});
