import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { GET_CONTACT_US_MESSAGE } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import { contactUsFactory } from "../../src/contact-us/contact-us.factory.js";
describe("get contact us suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("get contact us message successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const message = await contactUsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: GET_CONTACT_US_MESSAGE,
      token: admin.token,
      variables: { contactUsMessage: message.id },
    });
    expect(res.body.data.message._id).toBe(message.id);
  });
});
