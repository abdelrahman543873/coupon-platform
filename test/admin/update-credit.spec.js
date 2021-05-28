import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UPDATE_CREDIT } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import {
  buildCreditParams,
  creditFactory,
} from "../../src/credit/credit.factory";
import { CreditModel } from "../../src/credit/models/credit.model.js";
describe("update credit suite case", () => {

  it("should update credit and throw error if credit doesn't exist", async () => {
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
    await CreditModel.deleteMany({});
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CREDIT,
      variables: { ...params },
      token: admin.token,
    });
    expect(res1.body.statusCode).toBe(646);
  });
});
