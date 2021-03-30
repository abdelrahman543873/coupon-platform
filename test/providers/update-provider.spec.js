import { put } from "../request.js";
import { PROVIDER_MODIFICATION } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("update provider suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("update provider", async () => {
    const user = await providerFactory({ name: "bro", password: "12345678" });
    const input = {
      name: "something",
      password: "12345678",
      newPassword: "12345678",
    };
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.data.name).toBe(input.name);
  });

  it("error if wrong password", async () => {
    const user = await providerFactory({ name: "bro", password: "12345678" });
    const input = {
      name: "something",
      password: "12345670",
      newPassword: "12345678",
    };
    const res = await put({
      url: PROVIDER_MODIFICATION,
      variables: input,
      token: user.token,
    });
    expect(res.body.statusCode).toBe(607);
  });
});
