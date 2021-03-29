import { post } from "../request.js";
import { REGISTER } from "../endpoints/provider.js";
import { buildProviderParams } from "../../src/provider/provider.factory.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
describe("provider register suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("provider register", async () => {
    const {
      logoURL,
      isActive,
      code,
      fcmToken,
      qrURL,
      ...input
    } = await buildProviderParams();
    const res = await post({
      url: REGISTER,
      variables: input,
    });
    expect(res.body.data.user.name).toBe(input.name);
  });
});
