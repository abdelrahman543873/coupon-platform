import { couponFactory } from "../../src/coupon/coupon.factory";
import { CouponModel } from "../../src/coupon/models/coupon.model";
import { providerFactory } from "../../src/provider/provider.factory";
import { DELETE_COUPON } from "../endpoints/provider";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("delete coupon suite case", () => {
  it("delete coupon successfully", async () => {
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: DELETE_COUPON,
      token: provider.token,
      variables: { coupon: coupon._id },
    });
    const deletedCoupon = await CouponModel.findOne({ _id: coupon._id });
    expect(deletedCoupon).toBe(null);
    expect(res.body.data).toBe(true);
  });
});
