import { testRequest } from "../request.js";
import { ADD_TOKEN } from "../endpoints/notification.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { userFactory } from "../../src/user/user.factory.js";

describe("add token suite case", () => {
  it("add token successfully", async () => {
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_TOKEN,
      variables: { fcmToken: "something" },
    });
    expect(res.body.data.fcmToken).toBe("something");
  });

  it("add token successfully with provider authorization", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_TOKEN,
      variables: { fcmToken: "something" },
      token: provider.token,
    });
    expect(res.body.data.user.fcmToken).toBe("something");
  });

  it("add token successfully with customer authorization", async () => {
    const provider = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_TOKEN,
      variables: { fcmToken: "something" },
      token: provider.token,
    });
    expect(res.body.data.user.fcmToken).toBe("something");
  });

  it("add token successfully with admin authorization", async () => {
    const provider = await userFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_TOKEN,
      variables: { fcmToken: "something" },
      token: provider.token,
    });
    expect(res.body.data.user.fcmToken).toBe("something");
  });
});
