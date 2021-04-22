import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GET_CREDIT } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { creditsFactory } from "../../src/credit/credit.factory";
describe("update credit suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should update credit", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await creditsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CREDIT,
      token: admin.token,
    });
    expect(res.body.data._id).toBeTruthy();
  });
});
