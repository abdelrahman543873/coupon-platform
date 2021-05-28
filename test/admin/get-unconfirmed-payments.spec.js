import { testRequest } from "../request.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { GET_UNCONFIRMED_PAYMENTS } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
describe("admin get unconfirmed subscriptions suite case", () => {
  it("admin get unconfirmed subscriptions successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await providerCustomerCouponsFactory(
      10,
      {},
      {},
      {},
      { isConfirmed: false }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_UNCONFIRMED_PAYMENTS,
      token: admin.token,
    });
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(10);
  });
});
