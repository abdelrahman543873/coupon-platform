import { providerFactory } from "../../src/provider/provider.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { MANAGE_PROVIDER_STATUS } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
describe("manage provider status suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("manage admin status successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MANAGE_PROVIDER_STATUS,
      variables: { provider: provider.user },
      token: admin.token,
    });
    expect(res.body.data).toBe(true);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: MANAGE_PROVIDER_STATUS,
      variables: { provider: provider.user },
      token: admin.token,
    });
    expect(res1.body.data).toBe(false);
  });
});
