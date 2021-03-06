import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import path from "path";
import { ADD_COUPON } from "../endpoints/provider.js";
import { buildCouponParams } from "../../src/coupon/coupon.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
describe("add coupon suite case", () => {
  it("add coupon successfully", async () => {
    const mockProvider = await providerFactory();
    const { provider, isActive, logoURL, code, ...variables } =
      await buildCouponParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_COUPON,
      token: mockProvider.token,
      variables,
    });
    expect(res.body.data.provider.name).toBeTruthy();
    expect(res.body.data.category.enName).toBeTruthy();
    expect(res.body.data.enName).toBe(variables.enName);
  });

  // when trying to send notifications to fcm token
  // it("add coupon successfully and send notification to a user", async () => {
  //   const mockProvider = await providerFactory();
  //   const { provider, isActive, logoURL, code, ...variables } =
  //     await buildCouponParams();
  //   const customer = await userFactory({
  //     fcmToken:
  //       "dkPBSwn3h0pRotBud6IWsw:APA91bHyH1_p-WKyh_KWJQZwlk3Z_XclihspqsMA3b_lBLEBn64UV3rlh2a0QO5kQ2IZhCQ7qtNZ1mXtfQCFBsNPCm8qj4Hd88WMkpReoBALEIB5NDaMNYExhC8iQZV_x4Yh9hDMlofw",
  //   });
  //   const res = await testRequest({
  //     method: HTTP_METHODS_ENUM.POST,
  //     url: ADD_COUPON,
  //     token: mockProvider.token,
  //     variables,
  //   });
  //   expect(res.body.data.provider.name).toBeTruthy();
  //   expect(res.body.data.category.enName).toBeTruthy();
  //   expect(res.body.data.enName).toBe(variables.enName);
  // });
  it("should throw error if offer is bigger than service", async () => {
    const mockProvider = await providerFactory();
    const { provider, isActive, logoURL, code, ...variables } =
      await buildCouponParams({ servicePrice: 10, offerPrice: 20 });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_COUPON,
      token: mockProvider.token,
      variables,
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("should throw error if category doesn't exist", async () => {
    const mockProvider = await providerFactory();
    const { provider, isActive, logoURL, code, category, ...variables } =
      await buildCouponParams();
    variables.category = mockProvider._id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_COUPON,
      token: mockProvider.token,
      variables,
    });
    expect(res.body.statusCode).toBe(638);
  });
  it("successful coupon file upload", async () => {
    const provider = await providerFactory();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const { providerId, isActive, logoURL, code, ...variables } =
      await buildCouponParams();
    delete variables.provider;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_COUPON,
      token: provider.token,
      fileParam: "image",
      filePath,
      variables,
    });
    expect(res.body.data.provider.name).toBeTruthy();
    expect(res.body.data.category.enName).toBeTruthy();
    expect(res.body.data.logoURL).toContain(".jpg");
  });
});
