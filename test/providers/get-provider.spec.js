import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { GET_PROVIDER } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("get provider successfully", async () => {
    const mockUser = await providerFactory({});
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_PROVIDER,
      token: mockUser.token,
    });
    expect(res.body.data.provider.name).toBe(mockUser.name);
  });
});
