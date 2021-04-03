import { get, testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { GET_PROVIDER } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("get provider successfully", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
    });
    await providerFactory({ _id: user._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER,
      token: user.token,
    });
    expect(res.body.data.name).toBe(user.name);
  });
});
