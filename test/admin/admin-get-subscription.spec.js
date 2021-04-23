import { testRequest } from "../request.js";
import { providerCustomerCouponFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_GET_SUBSCRIPTION } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
describe("admin get subscription suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin get subscription successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const subscription = await providerCustomerCouponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${ADMIN_GET_SUBSCRIPTION}?subscription=${subscription._id}`,
      token: admin.token,
    });
    expect(res.body.data._id).toBe(subscription.id);
  });

  it("should get error if malformed id", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const subscription = await providerCustomerCouponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${ADMIN_GET_SUBSCRIPTION}?subscription=something`,
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(631);
  });
});
