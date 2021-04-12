import { UserRoleEnum } from "../../src/user/user-role.enum";
import { userFactory } from "../../src/user/user.factory";
import { RESET_PASSWORD, CHANGE_PASSWORD } from "../endpoints/reset-password";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForResetPassword } from "../reset-password/rollback-for-reset-password.js";
import { verificationFactory } from "../../src/verification/verification.factory";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { providerFactory } from "../../src/provider/provider.factory";
describe("reset password suite case", () => {
  afterEach(async () => {
    await rollbackDbForResetPassword();
  });
  it("reset password with phone", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { phone: admin.phone },
    });
    expect(res.body.success).toBe(true);
    expect(res.body.data.user._id).toBe(admin.id);
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
    expect(res.body.data.user._id).toBe(decodeURI(encodeURI(customer.user)));
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
    expect(res.body.data.user._id).toBe(decodeURI(encodeURI(customer.user)));
  });
  it("reset password with email", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: RESET_PASSWORD,
      variables: { email: admin.email },
    });
    expect(res.body.success).toBe(true);
    expect(res.body.data.user._id).toBe(admin.id);
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
