import { rollbackDbForNotification } from "./rollback-for-notification.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { notifyUsers } from "../../src/notification/notification.service.js";
import {
  NewCouponMessage,
  NewSubscriptionMessage,
} from "../../src/notification/notification.enum.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import {
  couponFactory,
  providerCustomerCouponFactory,
} from "../../src/coupon/coupon.factory.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
describe("notify users suite case", () => {
  afterEach(async () => {
    await rollbackDbForNotification();
  });
  it("should notify users successfully on coupon addition", async () => {
    await customerFactory();
    const coupon = await couponFactory();
    const provider = await providerFactory();
    const result = await notifyUsers(NewCouponMessage(coupon, provider));
    expect(result.failureCount).toBe(1);
  });

  it("should handle the case of empty token", async () => {
    await userFactory({ fcmToken: "", role: UserRoleEnum[1] });
    const coupon = await couponFactory();
    const provider = await providerFactory();
    const result = await notifyUsers(NewCouponMessage(coupon, provider));
    expect(result).toBe(null);
  });

  it("should notify provider on coupon subscription", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    const provider = await providerFactory();
    const subscription = await providerCustomerCouponFactory(
      {
        provider: provider._id,
      },
      { customer: customer._id },
      { coupon: coupon._id }
    );
    const result = await notifyUsers(
      NewSubscriptionMessage(customer, coupon, subscription),
      provider._id
    );
    expect(result.failureCount).toBe(1);
  });
});
