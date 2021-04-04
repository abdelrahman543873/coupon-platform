import { testRequest, testRequestWithFiles } from "../request.js";
import { PROVIDER_MODIFICATION, REGISTER } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import path from "path";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { CUSTOMER_REGISTER } from "../endpoints/customer.js";
import { provider } from "../../src/provider/models/provider.model.js";
describe("update provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("successfully update provider if all data is entered", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildUserParams()),
      ...(await buildProviderParams()),
    };
    const {
      role,
      isActive,
      code,
      fcmToken,
      logoURL,
      qrURL,
      user,
      ...input
    } = providerInput;
    input.password = "12345678";
    input.newPassword = "newPassword";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("only update provider", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildProviderParams()),
    };
    const {
      _id,
      isActive,
      code,
      fcmToken,
      logoURL,
      qrURL,
      user,
      ...input
    } = providerInput;
    input.password = "12345678";
    input.newPassword = "newPassword";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.data.slogan).toBe(input.slogan);
  });

  it("only update user", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ user: mockUser._id });
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { password, role, ...input } = providerInput;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("register and update", async () => {
    const { role, email, ...variables } = await buildUserParams();
    variables.slogan = "this is a long slogan ";
    const mockUser = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: REGISTER,
      variables,
    });
    const { user, isActive, fcmToken, qrURL, logoURL,...providerInput } = {
      ...(await buildProviderParams()),
    };
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: PROVIDER_MODIFICATION,
      variables: providerInput,
      token: mockUser.body.data.authToken,
    });
    expect(res2.body.data.slogan).toBe(providerInput.slogan);
  });

  it("successful file upload", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ user: mockUser._id });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: PROVIDER_MODIFICATION,
      token: mockUser.token,
      fileParam: "logo",
      filePath,
    });
    const fileStored = res.body.data.logoURL.includes(".jpg");
    expect(fileStored).toBe(true);
  });

  it("error if wrong password", async () => {
    const mockUser = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    const provider = await providerFactory({ user: mockUser.id });
    const input = {
      name: "something",
      password: "12345670",
      newPassword: "12345678",
    };
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: mockUser.token,
    });
    expect(res.body.statusCode).toBe(607);
  });
});
