import { testRequest } from "../request.js";
import { GET_NOTIFICATIONS } from "../endpoints/notification.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { notificationsFactory } from "../../src/notification/notification.factory.js";
import { rollbackDbForNotification } from "./rollback-for-notification.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { NotifiedEnum } from "../../src/notification/notification.enum.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
describe("get notifications suite case", () => {
  afterEach(async () => {
    await rollbackDbForNotification();
  });
  it("get notifications successfully", async () => {
    const customer = await customerFactory();
    await notificationsFactory(10, { user: NotifiedEnum[1] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
      token: customer.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get notifications successfully for provider", async () => {
    const provider = await providerFactory();
    await notificationsFactory(10, { user: NotifiedEnum[5], id: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
      token: provider.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });

  it("shouldn't get notifications for other providers", async () => {
    const provider = await providerFactory();
    const anotherProvider = await providerFactory();
    await notificationsFactory(10, {
      user: NotifiedEnum[5],
      id: anotherProvider._id,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
      token: provider.token,
    });
    expect(res.body.data.docs.length).toBe(0);
  });

  it("get notifications for unregistered users", async () => {
    await notificationsFactory(10, { user: NotifiedEnum[1] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
