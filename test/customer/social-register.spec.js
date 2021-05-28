import { buildUserParams, userFactory } from "../../src/user/user.factory";
import {
  CHANGE_PHONE,
  CUSTOMER_LOGIN,
  CUSTOMER_SOCIAL_REGISTER,
  UPDATE_CUSTOMER,
} from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import path from "path";
import { buildCustomerParams } from "../../src/customer/customer.factory";
describe("customer social register suite case", () => {
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
    expect(res.body.data.user.isSocialMediaVerified).toBe(true);
    expect(res.body.data.user.password).toBeFalsy();
    expect(res.body.data.user.user).toBeFalsy();
    expect(res.body.data.user.profilePictureURL).toBe(
      variables.profilePictureURL
    );
    expect(res.body.data.user.name).toBe(variables.name);
  });

  it("customer social register successfully and then login trial", async () => {
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
    expect(res.body.data.user.isSocialMediaVerified).toBe(true);
    expect(res.body.data.user.password).toBeFalsy();
    expect(res.body.data.user.user).toBeFalsy();
    expect(res.body.data.user.profilePictureURL).toBe(
      variables.profilePictureURL
    );
    expect(res.body.data.user.name).toBe(variables.name);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_LOGIN,
      variables: { email: res.body.data.user.email, password: "something" },
    });
    expect(res1.body.statusCode).toBe(603);
  });

  it("customer social register successfully and then add a phone", async () => {
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
    expect(res.body.data.user.isSocialMediaVerified).toBe(true);
    expect(res.body.data.user.password).toBeFalsy();
    expect(res.body.data.user.user).toBeFalsy();
    expect(res.body.data.user.profilePictureURL).toBe(
      variables.profilePictureURL
    );
    expect(res.body.data.user.name).toBe(variables.name);
    const params = await buildUserParams();
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CHANGE_PHONE,
      variables: { phone: params.phone },
      token: res.body.data.authToken,
    });
    expect(res1.body.data.user._id).toBeTruthy();
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: { phone: params.phone, code: "12345" },
      token: res.body.data.authToken,
    });
    expect(res2.body.data.user.password).toBeFalsy();
    expect(res2.body.data.user.favCoupons).toBeTruthy();
    expect(res2.body.data.user.phone).toBe(params.phone);
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
    expect(res.body.data.user.password).toBeFalsy();
    expect(res.body.data.user.user).toBeFalsy();
    expect(res.body.data.user.profilePictureURL).toBe(
      variables.profilePictureURL
    );
    expect(res.body.data.user.name).toBe(variables.name);
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
      variables: {
        email: variables2.email,
        name: variables2.name,
        socialMediaId: "something",
        socialMediaType: "FACEBOOK",
      },
    });
    expect(res2.body.data.user.password).toBeFalsy();
    expect(res2.body.data.user.user).toBeFalsy();
    expect(res2.body.data.user.name).toBe(variables2.name);
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
