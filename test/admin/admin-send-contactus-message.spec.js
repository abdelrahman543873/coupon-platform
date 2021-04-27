import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ADMIN_SEND_CONTACT_US_MESSAGE } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { userFactory } from "../../src/user/user.factory.js";
import {
  buildContactUsParams,
  contactUsFactory,
} from "../../src/contact-us/contact-us.factory.js";
describe("admin send contact us messages suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin send contact us messages successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const message = await contactUsFactory();
    const params = await buildContactUsParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_SEND_CONTACT_US_MESSAGE,
      token: admin.token,
      variables: { reply: params.reply.message, messageId: message.id },
    });
    expect(res.body.data.reply.message).toBe(params.reply.message);
  });
});
