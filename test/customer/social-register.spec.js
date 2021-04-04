import { buildUserParams } from "../../src/user/user.factory";
import { CUSTOMER_SOCIAL_REGISTER } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";
import path from "path";
import { buildCustomerParams } from "../../src/customer/customer.factory";
describe("customer social register suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer social register successfully", async () => {
    const {
      role,
      user,
      isVerified,
      isSocialMediaVerified,
      favCoupons,
      fcmToken,
      password,
      profilePictureURL,
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
    expect(res.body.data.name).toBe(variables.name);
  });

  it("customer social register with file upload", async () => {
    const { role, ...variables } = await buildUserParams();
    const testFiles = path.resolve(process.cwd(), "test");
    const filePath = `${testFiles}/test-files/test-duck.jpg`;
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CUSTOMER_SOCIAL_REGISTER,
      variables,
      fileParam: "profile-picture",
      filePath,
    });
    const fileStored = res.body.data.profilePictureURL.includes(".jpg");
    expect(fileStored).toBe(true);
    expect(res.body.data.name).toBe(variables.name);
  });
});
