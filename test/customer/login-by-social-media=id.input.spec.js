import { customerFactory } from "../../src/customer/customer.factory";
import { SOCIAL_MEDIA_LOGIN } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("social media login suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("social media login suite case", async () => {
    const customer = await customerFactory({ isVerified: true });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: SOCIAL_MEDIA_LOGIN,
      token: customer.token,
      variables: { socialMediaId: customer.socialMediaId },
    });
    expect(res.body.data.socialMediaId).toBe(customer.socialMediaId);
  });
});
