import { post } from "../request.js";
import { REGISTER } from "../endpoints/provider.js";
import { buildProviderParams } from "../../src/provider/provider.factory.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { buildUserParams } from "../../src/user/user.factory.js";
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
      userId,
      ...input
    } = providerInput;
    const res = await post({
      url: REGISTER,
      variables: input,
    });
    expect(res.body.data.user.name).toBe(input.name);
  });
});
