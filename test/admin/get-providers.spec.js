import { GET_PROVIDERS } from "../endpoints/admin.js";
import { providersFactory } from "../../src/provider/provider.factory.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
describe("get providers register suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should get providers", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await providersFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDERS,
      token: admin.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
