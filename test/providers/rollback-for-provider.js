import { rawDeleteCategory } from "../../src/category/category.repository";
import {
  rawDeleteCoupon,
  rawDeleteProviderCustomerCoupon,
} from "../../src/coupon/coupon.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForProvider() {
  await rawDeleteCategory()
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteProvider();
  await rawDeleteUser();
}
