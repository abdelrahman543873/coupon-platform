import { testRequest } from "../request.js";
import { REGISTER } from "../endpoints/provider.js";
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
    const mockUser = await providerFactory({ password: "12345678" });
    const providerInput = await buildProviderParams();
    const {
      role,
      isActive,
      code,
      locations,
      fcmToken,
      logoURL,
      qrURL,
      image,
      ...input
    } = providerInput;
    input.provider = mockUser._id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.provider.name).toBe(input.name);
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
      locations,
      fcmToken,
      logoURL,
      qrURL,
      user,
      image,
      role,
      ...input
    } = providerInput;
    input.provider = provider._id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.provider.slogan).toBe(input.slogan);
  });

  it("only update user", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory({ password: "12345678" });
    const providerInput = await buildUserParams();
    const { password, role, phone, ...input } = providerInput;
    input.provider = provider._id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: input,
      token: admin.token,
    });
    expect(res.body.data.provider.name).toBe(input.name);
    expect(res.body.data.provider.email).toBe(input.email);
  });

  it("register and update", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { role, phone, ...variables } = await buildUserParams();
    variables.slogan = "this is a long slogan ";
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: REGISTER,
      variables,
    });
    const {
      image,
      locations,
      isActive,
      fcmToken,
      qrURL,
      logoURL,
      ...providerInput
    } = {
      ...(await buildProviderParams()),
    };
    delete providerInput.role;
    providerInput.provider = res.body.data.user._id;
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: ADMIN_UPDATE_PROVIDER,
      variables: providerInput,
      token: admin.token,
    });
    expect(res2.body.data.provider.slogan).toBe(providerInput.slogan);
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
      variables: { provider: provider._id },
      fileParam: "image",
      filePath,
    });
    expect(res.body.data.provider.image).toContain(".jpg");
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
      fileParam: "image",
      filePath,
    });
    expect(res.body.statusCode).toBe(400);
  });
});
