import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { GET_CONTACT_US_MESSAGES } from "../endpoints/admin.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import {
  contactUsMessagesFactory,
  contactUsFactory,
} from "../../src/contact-us/contact-us.factory.js";
describe("get contact us messages suite case", () => {
  it("get contact us messages successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    await contactUsMessagesFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CONTACT_US_MESSAGES,
      token: admin.token,
    });
    expect(res.body.data.messages.docs[0].name).toBeTruthy();
    expect(res.body.data.messages.docs[0].image).toBeTruthy();
    expect(res.body.data.messages.docs.length).toBeGreaterThanOrEqual(10);
  });

  it("get contact us messages successfully filtered by email", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const contact = await contactUsFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CONTACT_US_MESSAGES}?email=${contact.email}`,
      token: admin.token,
    });
    expect(res.body.data.messages.docs[0].email).toBe(contact.email);
    expect(res.body.data.messages.docs[0].name).toBeTruthy();
    expect(res.body.data.messages.docs[0].image).toBeTruthy();
  });
});
