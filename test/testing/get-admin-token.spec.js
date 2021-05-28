import { GET_ADMIN_TOKEN } from "../endpoints/testing.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get admin token suite case", () => {
  it("get admin token suite case", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_ADMIN_TOKEN,
    });
    expect(res.body.authToken).toBeTruthy();
  });
});
