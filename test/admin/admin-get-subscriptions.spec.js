import { testRequest } from "../request.js";
import {
  couponsFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_GET_SUBSCRIPTIONS } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { categoryFactory } from "../../src/category/category.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("admin get coupons suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin get subscriptions successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await providerCustomerCouponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: ADMIN_GET_SUBSCRIPTIONS,
      token: admin.token,
    });
    expect(res.body.data.subscriptions.docs.length).toBe(10);
  });

  it("should filter coupons by provider", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { provider: provider.user },
      {},
      { provider: provider.user }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${ADMIN_GET_SUBSCRIPTIONS}?provider=${provider.user}`,
      token: admin.token,
    });
    expect(res.body.data.subscriptions.docs.length).toBe(10);
  });
});