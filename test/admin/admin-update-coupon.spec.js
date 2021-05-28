import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import path from "path";
import { UPDATE_COUPON } from "../endpoints/provider.js";
import {
  buildCouponParams,
  couponFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_UPDATE_COUPON } from "../endpoints/admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
describe("admin update coupon suite case", () => {
  it("admin update coupon successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const coupon = await couponFactory();
    const {
      provider,
      isActive,
      logoURL,
      code,
      ...variables
    } = await buildCouponParams();
    variables.coupon = coupon.id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_COUPON,
      token: admin.token,
      variables,
    });
    expect(res.body.data.enName).toBe(variables.enName);
  });
  it("successful coupon file upload", async () => {
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider._id });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const {
      providerId,
      isActive,
      logoURL,
      code,
      ...variables
    } = await buildCouponParams();
    delete variables.provider;
    variables.coupon = coupon.id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_COUPON,
      token: provider.token,
      fileParam: "image",
      filePath,
      variables,
    });
    expect(res.body.data.logoURL).toContain(".jpg");
  });
});
