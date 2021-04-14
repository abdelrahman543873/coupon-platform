import { providerFactory } from "../../src/provider/provider.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GENERATE_PDF } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
describe("generate pdf suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("generate pdf successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: GENERATE_PDF,
      variables: { provider: provider._id },
      token: admin.token,
    });
    expect(res.body.data.qrURL).toContain(".png");
  });
});
