import { UserRoleEnum } from "../../src/user/user-role.enum";
import { buildUserParams, userFactory } from "../../src/user/user.factory";
import { RESET_PASSWORD, CHANGE_PASSWORD } from "../endpoints/reset-password";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { verificationFactory } from "../../src/verification/verification.factory";
import { customerFactory } from "../../src/customer/customer.factory.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory";
import { REGISTER } from "../endpoints/provider.js";
describe("reset password suite case", () => {
  it("reset password with phone", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { phone: admin.phone },
    });
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe(true);
  });

  it("reset password for non existing user by phone", async () => {
    const admin = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { phone: admin.phone },
    });
    expect(res.body.statusCode).toBe(611);
  });

  it("reset password for non existing user by email", async () => {
    const admin = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { email: admin.email },
    });
    expect(res.body.statusCode).toBe(611);
  });

  it("should register provider and then verify otp", async () => {
    const providerInput = await buildProviderParams();
    const {
      image,
      isActive,
      code,
      metaData,
      fcmToken,
      locations,
      qrURL,
      role,
      isVerified,
      _id,
      user,
      ...input
    } = providerInput;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: REGISTER,
      variables: input,
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { email: res.body.data.user.email, code: "12345" },
    });
    expect(res1.body.data.user.isVerified).toBe(true);
    expect(res1.body.data.user.email).toBe(res.body.data.user.email);
  });

  it("customer reset password with phone", async () => {
    const user = await userFactory({ role: UserRoleEnum[1] });
    const customer = await customerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { phone: user.phone },
    });
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe(true);
  });

  it("provider reset password with phone", async () => {
    const user = await userFactory({ role: UserRoleEnum[0] });
    const customer = await providerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { phone: user.phone },
    });
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe(true);
  });
  it("reset password with email", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { email: admin.email },
    });
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe(true);
  });

  it("should throw error if code and not email or phone", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const verification = await verificationFactory({ email: admin.email });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { code: verification.code },
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("should throw error if wrong code", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await verificationFactory({ email: admin.email });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { code: 1111, email: admin.email },
    });
    expect(res.body.statusCode).toBe(617);
  });

  it("should return user and auth token if code is right", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await verificationFactory({ email: admin.email });
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { email: admin.email },
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { code: "12345", email: admin.email },
    });
    expect(res1.body.data.user._id).toBe(admin.id);
  });

  it("should change password successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const verification = await verificationFactory({ email: admin.email });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: {
        code: verification.code,
        email: admin.email,
      },
    });
    expect(res.body.data.authToken).toBeTruthy();
  });
  it("should reset password successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const verification = await verificationFactory({ email: admin.email });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: {
        code: verification.code,
        email: admin.email,
      },
    });
    expect(res.body.data.authToken).toBeTruthy();
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CHANGE_PASSWORD,
      variables: { newPassword: "something12" },
      token: res.body.data.authToken,
    });
    expect(res1.body.data).toBe(true);
  });
});
