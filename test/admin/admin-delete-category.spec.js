import { testRequest } from "../request.js";
import { ADMIN_DELETE_CATEGORY } from "../endpoints/admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import {
  couponFactory,
  providerCustomerCouponFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { categoryFactory } from "../../src/category/category.factory.js";
describe("admin delete category suite case", () => {
  it("admin delete category successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const category = await categoryFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_CATEGORY,
      token: admin.token,
      variables: { category: category.id },
    });
    expect(res.body.data.category.enName).toBe(category.enName);
  });

  it("error if category has coupons", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const category = await categoryFactory();
    const coupon = await couponFactory({ category: category.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_CATEGORY,
      token: admin.token,
      variables: { category: coupon.category },
    });
    expect(res.body.statusCode).toBe(630);
  });
});
