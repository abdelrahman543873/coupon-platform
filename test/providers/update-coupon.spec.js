import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import path from "path";
import { UPDATE_COUPON } from "../endpoints/provider.js";
import {
  buildCouponParams,
  couponFactory,
} from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
describe("update coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("update coupon successfully", async () => {
    const mockProvider = await providerFactory();
    const coupon = await couponFactory({ provider: mockProvider.user });
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
      url: UPDATE_COUPON,
      token: mockProvider.token,
      variables,
    });
    expect(res.body.data.enName).toBe(variables.enName);
  });
  it("successful coupon file upload", async () => {
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider.user });
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
    const fileStored = res.body.data.logoURL.includes(".jpg");
    expect(fileStored).toBe(true);
  });
});
