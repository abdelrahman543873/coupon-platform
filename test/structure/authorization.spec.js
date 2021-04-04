import { testRequest } from "../request.js";
import { GET_PROVIDER } from "../endpoints/provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("successful error handling case", () => {
  it("get 613 if token is malformed", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER,
      token: "malformed token",
    });
    expect(res.body.statusCode).toBe(613);
  });
});
