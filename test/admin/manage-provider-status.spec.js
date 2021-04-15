import { couponsFactory } from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { MANAGE_PROVIDER_STATUS } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { findProviderCouponsRepository } from "../../src/coupon/coupon.repository";
describe("manage provider status suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("manage admin status successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory({ qrURL: null });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MANAGE_PROVIDER_STATUS,
      variables: { provider: provider._id },
      token: admin.token,
    });
    expect(res.body.data.qrURL).toBeTruthy();
    expect(res.body.data.isActive).toBe(true);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MANAGE_PROVIDER_STATUS,
      variables: { provider: provider._id },
      token: admin.token,
    });
    expect(res.body.data.qrURL).toBeTruthy();
    expect(res1.body.data.isActive).toBe(false);
  });

  it("should deactivate admins coupons when deactivating admin", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const coupons = await couponsFactory(10, { provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MANAGE_PROVIDER_STATUS,
      variables: { provider: provider._id },
      token: admin.token,
    });
    const couponsBeforeDeactivation = await findProviderCouponsRepository(
      provider._id
    );
    expect(couponsBeforeDeactivation[0].isActive).toBe(true);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MANAGE_PROVIDER_STATUS,
      variables: { provider: provider._id },
      token: admin.token,
    });
    const couponsAfterDeactivation = await findProviderCouponsRepository(
      provider._id
    );
    expect(couponsAfterDeactivation[0].isActive).toBe(false);
  });
});
