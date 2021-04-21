import { rawDeleteCoupon } from "../../src/coupon/coupon.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";
import { rawDeleteProviderCustomerCoupon } from "../../src/subscription/subscription.repository.js";

export async function rollbackDbForCoupon() {
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteProvider();
  await rawDeleteUser();
}
