import { testRequest } from "../request.js";
import { ADMIN_DELETE_COUPON } from "../endpoints/admin.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { couponFactory } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("admin delete coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin delete coupon successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_COUPON,
      token: admin.token,
      variables: { coupon: coupon.id },
    });
    expect(res.body.data.coupon.enName).toBe(coupon.enName);
  });
});
