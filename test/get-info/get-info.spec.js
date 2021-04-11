import { customerFactory } from "../../src/customer/customer.factory";
import { providerFactory } from "../../src/provider/provider.factory";
import { UserRoleEnum } from "../../src/user/user-role.enum";
import { userFactory } from "../../src/user/user.factory";
import { GET_INFO } from "../endpoints/get-info";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForGetInfo } from "./rollback-for-get-info";

describe("get info suite case", () => {
  afterEach(async () => {
    await rollbackDbForGetInfo();
  });
  it("should get info for customer", async () => {
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_INFO,
      token: customer.token,
    });
    expect(res.body.data.user.socialMediaId).toBe(customer.socialMediaId);
  });

  it("should get all info for provider", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_INFO,
      token: provider.token,
    });
    expect(res.body.data.user.name).toBeTruthy();
    expect(res.body.data.user.slogan).toBe(provider.slogan);
  });

  it("should get info for user", async () => {
    const user = await userFactory({ role: UserRoleEnum[2] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_INFO,
      token: user.token,
    });
    expect(res.body.data.user._id).toBe(user.id);
  });
});
