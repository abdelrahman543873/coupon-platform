import { testRequest } from "../request.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
import { CUSTOMER_LOGIN } from "../endpoints/customer";
import { customerFactory } from "../../src/customer/customer.factory.js";
describe("customer login suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer login by email successfully", async () => {
    const user = await userFactory({
      role: UserRoleEnum[1],
      password: "something",
    });
    await customerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_LOGIN,
      variables: { email: user.email, password: "something" },
    });
    expect(res.body.data.user.name).toBe(user.name);
  });

  it("should throw error if customer isn't verified", async () => {
    const user = await userFactory({
      role: UserRoleEnum[1],
      password: "something",
    });
    await customerFactory({ user: user.id, isVerified: false });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_LOGIN,
      variables: { email: user.email, password: "something" },
    });
    expect(res.body.statusCode).toBe(648);
  });

  it("customer login by phone successfully", async () => {
    const user = await userFactory({
      role: UserRoleEnum[1],
      password: "something",
    });
    await customerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_LOGIN,
      variables: { phone: user.phone, password: "something" },
    });
    expect(res.body.data.user.name).toBe(user.name);
  });

  it("error if wrong password", async () => {
    const user = await userFactory({
      role: UserRoleEnum[1],
      password: "something",
    });
    await customerFactory({ user: user.id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_LOGIN,
      variables: { phone: user.phone, password: "someoneInHere" },
    });
    expect(res.body.statusCode).toBe(603);
  });

  it("error if user doesn't exist", async () => {
    const params = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_LOGIN,
      variables: { phone: params.phone, password: params.password },
    });
    expect(res.body.statusCode).toBe(603);
  });
});
