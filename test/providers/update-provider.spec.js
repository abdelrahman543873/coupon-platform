import { put } from "../request.js";
import { PROVIDER_MODIFICATION } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
describe("update provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("successfully update provider if all data is entered", async () => {
    const user = await userFactory({ password: "12345678" });
    await providerFactory({ userId: user._id });
    const providerInput = {
      ...(await buildUserParams()),
      ...(await buildProviderParams()),
    };
    const {
      password,
      role,
      userId,
      isActive,
      code,
      fcmToken,
      logoURL,
      qrURL,
      ...input
    } = providerInput;
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("error if wrong password", async () => {
    const user = await userFactory({ password: "12345678" });
    const provider = await providerFactory({ userId: user.id });
    const input = {
      name: "something",
      password: "12345670",
      newPassword: "12345678",
    };
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.statusCode).toBe(607);
  });
});
