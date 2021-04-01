import { post } from "../request.js";
import { REGISTER } from "../endpoints/provider.js";
import { buildProviderParams } from "../../src/provider/provider.factory.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
describe("provider register suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("provider register", async () => {
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
      ...input
    } = providerInput;
    const res = await post({
      url: REGISTER,
      variables: input,
    });
    expect(res.body.data.user.name).toBe(input.name);
  });

  it("error if user already exists", async () => {
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
    const res = await post({
      url: REGISTER,
      variables: input,
    });
    expect(res.body.statusCode).toBe(601);
  });
});
