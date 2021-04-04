import { testRequest } from "../request.js";
import { GET_PROVIDER } from "../endpoints/provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { rawDeleteUser } from "../../src/user/user.repository.js";
describe("successful error handling case", () => {
  it("get 613 if token is malformed", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER,
      token: "malformed token",
    });
    expect(res.body.statusCode).toBe(613);
  });

  it("get 614 if user no longer exists", async () => {
    const user = await userFactory();
    await rawDeleteUser();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER,
      token: user.token,
    });
    expect(res.body.statusCode).toBe(614);
  });
});
