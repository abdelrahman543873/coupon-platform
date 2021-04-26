import { testRequest } from "../request.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { UPDATE_ADMIN } from "./../endpoints/admin.js";
import { rollbackDbForCustomer } from "./../customer/rollback-for-customer.js";
import { verificationFactory } from "../../src/verification/verification.factory.js";
describe("update customer suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("successfully change password", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const { role, phone, email, fcmToken,...variables } = await buildUserParams();
    variables.newPassword = variables.password;
    variables.password = "12345678";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables,
      token: user.token,
    });
    expect(res.body.data.user.name).toBe(variables.name);
  });

  it("no error if only correct password is entered", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables: { password: "12345678" },
      token: user.token,
    });
    expect(res.body.data.user._id).toBe(user.id);
  });

  it("should update email if otp provided", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
    });
    await verificationFactory({ email: user.email, code: "12345" });
    const params = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables: { email: params.email, code: "12345" },
      token: user.token,
    });
    expect(res.body.data.user.email).toBe(params.email);
  });

  it("should error if otp is wrong", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
    });
    await verificationFactory({ email: user.email, code: "12345" });
    const params = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables: { email: params.email, code: "123456" },
      token: user.token,
    });
    expect(res.body.statusCode).toBe(617);
  });

  it("error if phone without password is entered", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const { role, password, fcmToken,...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables,
      token: user.token,
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("error if wrong password", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const input = {
      password: "12345670",
      newPassword: "12345678",
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(607);
  });

  it("error if two passwords are the same", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const input = {
      password: "12345678",
      newPassword: "12345678",
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(400);
  });
});
