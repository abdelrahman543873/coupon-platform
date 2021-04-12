import { testRequest } from "../request.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { UPDATE_ADMIN } from "./../endpoints/admin.js";
import { rollbackDbForCustomer } from "./../customer/rollback-for-customer.js";
import path from "path";
describe("update customer suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("successfully update customer if all data is entered", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const { role, ...variables } = await buildUserParams();
    variables.newPassword = variables.password;
    variables.password = "12345678";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables,
      token: user.token,
    });
    expect(res.body.data.user.name).toBe(variables.name);
    expect(res.body.data.user.phone).toBe(variables.phone);
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

  it("error if password is wrong when changing the phone", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const { role, ...variables } = await buildUserParams();
    variables.newPassword = variables.password;
    variables.password = "123456789";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_ADMIN,
      variables,
      token: user.token,
    });
    expect(res.body.statusCode).toBe(607);
  });

  it("error if phone without password is entered", async () => {
    const user = await userFactory({
      role: UserRoleEnum[2],
      password: "12345678",
    });
    const { role, password, ...variables } = await buildUserParams();
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
