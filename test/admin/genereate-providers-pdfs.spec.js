import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GENERATE_PDF, GET_PROVIDERS_PDF } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("add category suite case", () => {
  it("should generate providers pdf", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const something = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: GENERATE_PDF,
      variables: { provider: provider._id },
      token: admin.token,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDERS_PDF,
      token: admin.token,
    });
    expect(res.body.data).toBe(
      "http://api2.couponat.alefsoftware.com/./public/providers-pdf/AllProviders.pdf"
    );
  });
});
