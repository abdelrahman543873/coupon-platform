import { ADD_PROVIDER } from "../endpoints/admin.js";
import { buildProviderParams } from "../../src/provider/provider.factory.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
describe("provider register suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should add provider", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const providerInput = {
      ...(await buildUserParams()),
      ...(await buildProviderParams()),
    };
    const {
      logoURL,
      isActive,
      code,
      fcmToken,
      qrURL,
      role,
      _id,
      user,
      ...input
    } = providerInput;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.user.name).toBe(input.name);
  });

  it("error if user already exists", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    const input = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: "something",
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(601);
  });
});