import { testRequest } from "../request.js";
import path from "path";
import { buildCouponParams } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_ADD_COUPON } from "../endpoints/admin.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
describe("admin add coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin add coupon successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, logoURL, code, ...variables } = await buildCouponParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_COUPON,
      token: admin.token,
      variables,
    });
    expect(res.body.data.enName).toBe(variables.enName);
  });
  it("successful admin coupon file upload", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const { isActive, logoURL, code, ...variables } = await buildCouponParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_COUPON,
      token: admin.token,
      fileParam: "image",
      filePath,
      variables,
    });
    expect(res.body.data.logoURL).toContain(".jpg");
  });

  it("should throw error if category doesn't exist", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const {
      provider,
      isActive,
      logoURL,
      code,
      category,
      ...variables
    } = await buildCouponParams();
    variables.category = admin._id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_COUPON,
      token: admin.token,
      variables,
    });
    expect(res.body.statusCode).toBe(638);
  });
});
