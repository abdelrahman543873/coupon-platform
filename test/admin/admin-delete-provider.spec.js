import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { providerCustomerCouponsFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_DELETE_PROVIDER } from "../endpoints/admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
describe("admin delete provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin delete provider successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_PROVIDER,
      token: admin.token,
      variables: { provider: provider._id },
    });
    expect(res.body.data.provider.slogan).toBe(provider.slogan);
  });

  it("should throw error if provider doesn't exist", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_PROVIDER,
      token: admin.token,
      variables: { provider: admin._id },
    });
    expect(res.body.statusCode).toBe(617);
  });

  it("error if admin has sold coupons", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      {},
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_PROVIDER,
      token: admin.token,
      variables: { provider: provider._id },
    });
    expect(res.body.statusCode).toBe(628);
  });
});
