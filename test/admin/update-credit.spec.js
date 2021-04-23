import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UPDATE_CREDIT } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import {
  buildCreditParams,
  creditFactory,
} from "../../src/credit/credit.factory";
describe("update credit suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("should update credit", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await creditFactory();
    const params = await buildCreditParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CREDIT,
      variables: { ...params },
      token: admin.token,
    });
    expect(res.body.data.merchantEmail).toBe(params.merchantEmail);
    expect(res.body.data.secretKey).toBe(params.secretKey);
  });

  it("should throw error if credit doesn't exist", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const params = await buildCreditParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CREDIT,
      variables: { ...params },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(646);
  });
});
