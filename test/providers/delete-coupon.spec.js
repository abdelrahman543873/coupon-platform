import { couponFactory } from "../../src/coupon/coupon.factory";
import { providerFactory } from "../../src/provider/provider.factory";
import { DELETE_COUPON } from "../endpoints/provider";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForProvider } from "./rollback-for-provider";

describe("delete coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("delete coupon successfully", async () => {
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: DELETE_COUPON,
      token: provider.token,
      variables: { coupon: coupon._id },
    });
    expect(res.body.data.coupon._id).toBe(decodeURI(encodeURI(coupon._id)));
  });
});
