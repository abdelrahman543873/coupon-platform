import { testRequest } from "../request.js";
import { GET_NOTIFICATIONS } from "../endpoints/notification.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { notificationsFactory } from "../../src/notification/notification.factory.js";
import { rollbackDbForNotification } from "./rollback-for-notification.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { NotifiedEnum } from "../../src/notification/notification.enum.js";
describe("get categories suite case", () => {
  afterEach(async () => {
    await rollbackDbForNotification();
  });
  it("get categories successfully", async () => {
    const customer = await customerFactory();
    await notificationsFactory(10, { user: NotifiedEnum[1] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
      token: customer.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
