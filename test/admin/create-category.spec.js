import { buildCategoryParams } from "../../src/category/category.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { ADD_CATEGORY } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import path from "path";
describe("add category suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("error if files aren't uploaded", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { selected, unSelected, ...category } = await buildCategoryParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CATEGORY,
      variables: category,
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(637);
  });

  it("successful category file upload", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { selected, unSelected, ...category } = await buildCategoryParams();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CATEGORY,
      variables: category,
      token: admin.token,
      fileParams: ["selected", "unSelected"],
      filePath,
    });
    expect(res.body.data.selected).toContain(".jpg");
    expect(res.body.data.unSelected).toContain(".jpg");
  });

  it("should throw error if on file params is missing", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { selected, unSelected, ...category } = await buildCategoryParams();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CATEGORY,
      variables: category,
      token: admin.token,
      fileParams: ["selected"],
      filePath,
    });
    expect(res.body.statusCode).toBe(637);
  });
});
