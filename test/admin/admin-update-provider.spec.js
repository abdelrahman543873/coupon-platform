import { testRequest } from "../request.js";
import { PROVIDER_MODIFICATION, REGISTER } from "../endpoints/provider.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import path from "path";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { ADMIN_UPDATE_PROVIDER } from "../endpoints/admin.js";
describe("admin update provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("successfully admin update provider if all data is entered", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
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
      ...input
    } = providerInput;
    input.provider = mockUser._id;
    delete input.user;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("only admin update provider", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
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
    input.provider = provider.user;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.slogan).toBe(input.slogan);
  });

  it("only update user", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { password, role, ...input } = providerInput;
    input.provider = provider.user;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.name).toBe(input.name);
    expect(res.body.data.phone).toBe(input.phone);
  });

  it("register and update", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { role, email, ...variables } = await buildUserParams();
    variables.slogan = "this is a long slogan ";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: REGISTER,
      variables,
    });
    const { user, isActive, fcmToken, qrURL, logoURL, ...providerInput } = {
      ...(await buildProviderParams()),
    };
    providerInput.provider = res.body.data.user._id;
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: providerInput,
      token: admin.token,
    });
    expect(res2.body.data.slogan).toBe(providerInput.slogan);
  });

  it("successful file upload", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      token: admin.token,
      variables: { provider: provider.user },
      fileParam: "logo",
      filePath,
    });
    expect(res.body.data.logoURL).toContain(".jpg");
  });

  it("successful validation with file upload", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await providerFactory();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      token: admin.token,
      fileParam: "logo",
      filePath,
    });
    expect(res.body.statusCode).toBe(400);
  });
});