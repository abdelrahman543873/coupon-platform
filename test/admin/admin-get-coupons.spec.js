import { testRequest } from "../request.js";
import { couponsFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_GET_COUPONS } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { categoryFactory } from "../../src/category/category.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("admin get coupons suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin get coupons successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await couponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: ADMIN_GET_COUPONS,
      token: admin.token,
    });
    expect(res.body.data.coupons.docs.length).toBe(10);
  });
  it("should filter coupons by category", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const category = await categoryFactory();
    await couponsFactory(10, { category: category._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${ADMIN_GET_COUPONS}?category=${category._id}`,
      token: admin.token,
    });
    expect(res.body.data.coupons.docs.length).toBe(10);
  });

  it("should filter coupons by provider", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    await couponsFactory(10, { provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${ADMIN_GET_COUPONS}?provider=${provider._id}`,
      token: admin.token,
    });
    expect(res.body.data.coupons.docs.length).toBe(10);
  });
});
