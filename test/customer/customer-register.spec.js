import { buildUserParams } from "../../src/user/user.factory";
import { CUSTOMER_REGISTER } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import path from "path";
describe("customer register suite case", () => {
  it("customer register", async () => {
    const { role, fcmToken, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    expect(res.body.data.user.name).toBe(variables.name);
  });

  it("should register register two customers", async () => {
    const { role, email, fcmToken, ...variables } = await buildUserParams();
    const variables2 = await buildUserParams();
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    delete variables2.email;
    delete variables2.role;
    delete variables2.fcmToken;
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables: variables2,
    });
    expect(res2.body.data.user.name).toBe(variables2.name);
  });

  it("customer register with file upload", async () => {
    const { role, fcmToken, ...variables } = await buildUserParams();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
      fileParam: "image",
      filePath,
    });
    const fileStored = res.body.data.user.profilePictureURL.includes(".jpg");
    expect(fileStored).toBe(true);
    expect(res.body.data.user.name).toBe(variables.name);
  });
});
