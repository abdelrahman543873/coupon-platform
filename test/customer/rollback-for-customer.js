import { rawDeleteCoupon, rawDeleteProviderCustomerCoupon } from "../../src/coupon/coupon.repository";
import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForCustomer() {
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteProvider();
  await rawDeleteCustomer();
  await rawDeleteUser();
}
