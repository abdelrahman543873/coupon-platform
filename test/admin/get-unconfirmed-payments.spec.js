import { testRequest } from "../request.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { GET_UNCONFIRMED_PAYMENTS } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
describe("admin get unconfirmed subscriptions suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin get unconfirmed subscriptions successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await providerCustomerCouponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_UNCONFIRMED_PAYMENTS,
      token: admin.token,
    });
    expect(res.body.data.subscriptions.docs.length).toBe(10);
  });
});
