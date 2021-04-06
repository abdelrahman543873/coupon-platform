import {
  rawDeleteCoupon,
  rawDeleteProviderCustomerCoupon,
} from "../../src/coupon/coupon.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForSearch() {
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteProvider();
  await rawDeleteUser();
}
