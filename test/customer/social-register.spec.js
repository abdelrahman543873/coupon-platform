import { buildUserParams, userFactory } from "../../src/user/user.factory";
import { CUSTOMER_SOCIAL_REGISTER } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";
import path from "path";
import { buildCustomerParams } from "../../src/customer/customer.factory";
describe("customer social register suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer social register successfully", async () => {
    const {
      role,
      user,
      isVerified,
      isSocialMediaVerified,
      favCoupons,
      fcmToken,
      password,
      ...variables
    } = {
      ...(await buildUserParams()),
      ...(await buildCustomerParams()),
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_SOCIAL_REGISTER,
      variables,
    });
    expect(res.body.data.profilePictureURL).toBe(variables.profilePictureURL);
    expect(res.body.data.name).toBe(variables.name);
  });

  it("customer social register with email only", async () => {
    const {
      role,
      user,
      isVerified,
      isSocialMediaVerified,
      favCoupons,
      fcmToken,
      password,
      phone,
      ...variables
    } = {
      ...(await buildUserParams()),
      ...(await buildCustomerParams()),
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_SOCIAL_REGISTER,
      variables,
    });
    expect(res.body.data.name).toBe(variables.name);
  });

  it("should register twice with email only", async () => {
    const {
      role,
      user,
      isVerified,
      isSocialMediaVerified,
      favCoupons,
      fcmToken,
      password,
      phone,
      ...variables
    } = {
      ...(await buildUserParams()),
      ...(await buildCustomerParams()),
    };
    const variables2 = {
      ...(await buildUserParams()),
      ...(await buildCustomerParams()),
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_SOCIAL_REGISTER,
      variables,
    });

    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_SOCIAL_REGISTER,
      variables: { email: variables2.email, name: variables2.name },
    });
    expect(res2.body.data.name).toBe(variables2.name);
    expect(res.body.data.name).toBe(variables.name);
  });

  it("error if customer register with same email", async () => {
    const {
      role,
      user,
      isVerified,
      isSocialMediaVerified,
      favCoupons,
      fcmToken,
      password,
      ...variables
    } = {
      ...(await buildUserParams()),
      ...(await buildCustomerParams()),
    };
    await userFactory({ email: variables.email });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_SOCIAL_REGISTER,
      variables,
    });
    expect(res.body.statusCode).toBe(601);
  });
});
