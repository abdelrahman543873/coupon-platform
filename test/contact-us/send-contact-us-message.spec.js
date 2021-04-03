import { post, testRequest } from "../request.js";
import { rollbackDbForContactUs } from "../contact-us/rollback-for-contact-us";
import { buildContactUsParams } from "../../src/contact-us/contact-us.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { SEND_CONTACT_US_MESSAGE } from "../endpoints/contact-us.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("send contact us message suite case", () => {
  afterEach(async () => {
    await rollbackDbForContactUs();
  });
  it("send contact us message successfully", async () => {
    const provider = await providerFactory();
    const { reply, type, ...contactUsMessage } = await buildContactUsParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SEND_CONTACT_US_MESSAGE,
      variables: contactUsMessage,
      token: provider.token,
    });
    expect(res.body.data.email).toBe(contactUsMessage.email);
  });
});
