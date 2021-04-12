import { testRequest } from "../request.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import {
  buildCustomerParams,
  customerFactory,
} from "../../src/customer/customer.factory.js";
import { CUSTOMER_REGISTER, UPDATE_CUSTOMER } from "./../endpoints/customer.js";
import { rollbackDbForCustomer } from "./../customer/rollback-for-customer.js";
import path from "path";
describe("update customer suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("successfully update customer if all data is entered", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildUserParams()),
      ...(await buildCustomerParams()),
    };
    const {
      role,
      isVerified,
      isSocialMediaVerified,
      socialMediaId,
      socialMediaType,
      favCoupons,
      profilePictureURL,
      fcmToken,
      user,
      ...input
    } = providerInput;
    input.password = "12345678";
    input.newPassword = "newPassword";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.data.user.name).toBe(input.name);
  });

  it("no error if only correct password is entered", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: {
        password: "12345678",
      },
      token: mockUser.token,
    });
    expect(res.body.data.user._id).toBe(mockUser.id);
  });

  it("only update user", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { password, role, ...input } = providerInput;
    input.password = "12345678";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.data.user.email).toBe(input.email);
    expect(res.body.data.user.phone).toBe(input.phone);
  });

  it("error if password is wrong when changing the phone", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
    });
    await customerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { role, ...input } = providerInput;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(607);
  });

  it("successfully change phone when right password entered", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { password, role, ...input } = providerInput;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: { ...input, password: "12345678" },
      token: mockUser.token,
    });
    expect(res.body.data.user.phone).toBe(input.phone);
  });

  it("error if phone without password is entered", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { password, role, ...input } = providerInput;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("register and update", async () => {
    const { role, ...variables } = await buildUserParams();
    const mockUser = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    const { password, phone, email, ...variables1 } = {
      ...(await buildUserParams()),
    };
    delete variables1.role;
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: variables1,
      token: mockUser.body.data.authToken,
    });
    expect(res2.body.data.user.name).toBe(variables1.name);
  });

  it("successful file upload", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser._id });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      token: mockUser.token,
      fileParam: "image",
      filePath,
    });
    expect(res.body.data.user.profilePictureURL).toContain(".jpg");
  });

  it("successful validation with file upload", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser._id });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      token: mockUser.token,
      fileParam: "image",
      filePath,
      variables: { password: "1234" },
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("error if wrong password", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser.id });
    const input = {
      password: "12345670",
      newPassword: "12345678",
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(607);
  });

  it("error if two passwords are the same", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[1],
      password: "12345678",
    });
    await customerFactory({ user: mockUser.id });
    const input = {
      password: "12345678",
      newPassword: "12345678",
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(400);
  });
});