import { GET_PROVIDER } from "../endpoints/admin.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
describe("admin get provider register suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should get provider", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_PROVIDER}?provider=${provider._id}`,
      token: admin.token,
    });
    expect(res.body.data.provider._id).toBe(provider.id);
  });

  it("should throw error if provider id is invalid", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory({ user: admin.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_PROVIDER}?provider=wrongId`,
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(631);
  });
});
