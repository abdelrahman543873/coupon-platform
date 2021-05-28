import {
  buildCategoryParams,
  categoryFactory,
} from "../../src/category/category.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UPDATE_CATEGORY } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import path from "path";
describe("update category suite case", () => {
  it("should update category successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { selected, unSelected, ...category } = await buildCategoryParams();
    const mockCategory = await categoryFactory();
    category.category = mockCategory.id;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CATEGORY,
      variables: category,
      token: admin.token,
    });
    expect(res.body.data.enName).toBe(category.enName);
  });

  it("should successfully update category file", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { selected, unSelected, ...category } = await buildCategoryParams();
    const mockCategory = await categoryFactory();
    category.category = mockCategory.id;
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CATEGORY,
      variables: category,
      token: admin.token,
      fileParams: ["selected", "unSelected"],
      filePath,
    });
    expect(res.body.data.selected).toContain(".jpg");
    expect(res.body.data.unSelected).toContain(".jpg");
  });

  it("should update only one image", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { selected, unSelected, ...category } = await buildCategoryParams();
    const mockCategory = await categoryFactory();
    category.category = mockCategory.id;
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CATEGORY,
      variables: category,
      token: admin.token,
      fileParams: ["selected"],
      filePath,
    });
    expect(res.body.statusCode).not.toBe(500);
  });
});
