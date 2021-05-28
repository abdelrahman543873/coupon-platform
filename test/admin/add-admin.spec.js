import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { ADD_ADMIN } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("add admin suite case", () => {
  it("add admin successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[3] });
    const { role, fcmToken, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_ADMIN,
      variables,
      token: admin.token,
    });
    expect(res.body.data.name).toBe(variables.name);
  });
});
