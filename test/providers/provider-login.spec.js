import { post, testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { PROVIDER_LOGIN } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("provider login suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("provider login by email successfully", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "something",
    });
    await providerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: PROVIDER_LOGIN,
      variables: { email: user.email, password: "something" },
    });
    expect(res.body.data.user.name).toBe(user.name);
  });

  it("provider login by phone successfully", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "something",
    });
    await providerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: PROVIDER_LOGIN,
      variables: { phone: user.phone, password: "something" },
    });
    expect(res.body.data.user.name).toBe(user.name);
  });

  it("error if wrong password", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "something",
    });
    await providerFactory({ _id: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: PROVIDER_LOGIN,
      variables: { phone: user.phone, password: "someoneInHere" },
    });
    expect(res.body.statusCode).toBe(603);
  });

  it("error if user doesn't exist", async () => {
    const params = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: PROVIDER_LOGIN,
      variables: { phone: params.phone, password: params.password },
    });
    expect(res.body.statusCode).toBe(603);
  });
});
