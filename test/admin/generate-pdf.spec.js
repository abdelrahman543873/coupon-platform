import { providerFactory } from "../../src/provider/provider.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { GENERATE_PDF } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("generate pdf suite case", () => {
  it("generate pdf successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: GENERATE_PDF,
      variables: { provider: provider._id },
      token: admin.token,
    });
    expect(res.body.data.qrURL).toContain(
      "http://api2.couponat.alefsoftware.com/public/provider-qr-codes"
    );
    expect(res.body.data.qrURL).toContain(".png");
  });
});
