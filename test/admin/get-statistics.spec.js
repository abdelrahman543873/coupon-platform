import { testRequest } from "../request.js";
import { ADMIN_GET_STATISTICS } from "../endpoints/admin.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import {
  couponFactory,
  couponsFactory,
  providerCustomerCouponFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import {
  providerFactory,
  providersFactory,
} from "../../src/provider/provider.factory.js";
import { CouponModel } from "../../src/coupon/models/coupon.model.js";
describe("statistics suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("get statistics successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await couponsFactory();
    await providersFactory();
    await providerCustomerCouponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: ADMIN_GET_STATISTICS,
      token: admin.token,
    });
    expect(res.body.data.providers).toBe(20);
    expect(res.body.data.coupons).toBe(20);
    expect(res.body.data.subscriptions).toBe(10);
  });

  it("get 0 when applying now date", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await couponsFactory();
    await providersFactory();
    await providerCustomerCouponsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: ADMIN_GET_STATISTICS,
      token: admin.token,
      variables: { filtrationDate: new Date().toISOString() },
    });
    expect(res.body.data.providers).toBe(0);
    expect(res.body.data.coupons).toBe(0);
    expect(res.body.data.subscriptions).toBe(0);
  });

  it("get all when applying early date", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await couponFactory();
    await providerFactory();
    await providerCustomerCouponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: ADMIN_GET_STATISTICS,
      token: admin.token,
      variables: {
        filtrationDate: "2018-04-10T12:44:47.872Z",
      },
    });
    expect(res.body.data.providers).toBe(2);
    expect(res.body.data.coupons).toBe(2);
    expect(res.body.data.subscriptions).toBe(1);
  });
});
