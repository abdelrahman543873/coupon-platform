import { put } from "../request.js";
import { PROVIDER_MODIFICATION } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory.js";
import { buildUserParams, userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import path from "path";
describe("update provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("successfully update provider if all data is entered", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ _id: user._id });
    const providerInput = {
      ...(await buildUserParams()),
      ...(await buildProviderParams()),
    };
    const {
      role,
      _id,
      isActive,
      code,
      fcmToken,
      logoURL,
      qrURL,
      ...input
    } = providerInput;
    input.password = "12345678";
    input.newPassword = "newPassword";
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("only update provider", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ _id: user._id });
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
      ...input
    } = providerInput;
    input.password = "12345678";
    input.newPassword = "newPassword";
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.data.slogan).toBe(input.slogan);
  });

  it("only update user", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ _id: user._id });
    const providerInput = {
      ...(await buildUserParams()),
    };
    const { password, role, ...input } = providerInput;
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("successful file upload", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    await providerFactory({ _id: user._id });
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await put({
      url: PROVIDER_MODIFICATION,
      token: user.token,
      fileParam: "logo",
      filePath,
    });
    const fileStored = res.body.data.logoURL.includes(".jpg");
    expect(fileStored).toBe(true);
  });

  it("error if wrong password", async () => {
    const user = await userFactory({
      role: UserRoleEnum[0],
      password: "12345678",
    });
    const provider = await providerFactory({ _id: user.id });
    const input = {
      name: "something",
      password: "12345670",
      newPassword: "12345678",
    };
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.statusCode).toBe(607);
  });
});
