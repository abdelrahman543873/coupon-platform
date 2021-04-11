import { buildUserParams } from "../../src/user/user.factory";
import { CUSTOMER_REGISTER } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";
import path from "path";
describe("customer register suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer register", async () => {
    const { role, ...variables } = await buildUserParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    expect(res.body.data.user.name).toBe(variables.name);
  });

  it("customer register twice", async () => {
    const { role, email, ...variables } = await buildUserParams();
    const variables2 = await buildUserParams();
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables,
    });
    delete variables2.email;
    delete variables2.role;
    const res2 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_REGISTER,
      variables: variables2,
    });
    expect(res2.body.data.user.name).toBe(variables2.name);
  });

  it("customer register with file upload", async () => {
    const { role, ...variables } = await buildUserParams();
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
