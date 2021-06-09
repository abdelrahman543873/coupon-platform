import { testRequest } from "../request.js";
import { GET_NOTIFICATIONS } from "../endpoints/notification.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { notificationsFactory } from "../../src/notification/notification.factory.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { NotifiedEnum } from "../../src/notification/notification.enum.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { providerCustomerCouponFactory } from "../../src/coupon/coupon.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { CONFIRM_PAYMENT } from "../endpoints/admin.js";
import { userFactory } from "../../src/user/user.factory.js";
describe("get notifications suite case", () => {
  it("get notifications successfully for customers and unregistered users", async () => {
    const customer = await customerFactory();
    await notificationsFactory(10, { user: NotifiedEnum[1] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
      token: customer.token,
    });
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(10);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
    });
    expect(res1.body.data.docs.length).toBeGreaterThanOrEqual(10);
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

  it("should get customer's notification if payment is declined", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const customer = await customerFactory();
    const subscription = await providerCustomerCouponFactory(
      {},
      { customer: customer.user },
      {}
    );
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: CONFIRM_PAYMENT,
      token: admin.token,
      variables: {
        subscription: subscription.id,
        enMessage: "something",
        arMessage: "كلم",
      },
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_NOTIFICATIONS,
      token: customer.token,
    });
    expect(res.body.data.docs[0].enTitle).toBe("something");
  });
});
