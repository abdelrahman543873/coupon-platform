import { rawDeleteCategory } from "../../src/category/category.repository";
import { rawDeleteCity } from "../../src/city/city.repository";
import {
  rawDeleteCoupon,
  rawDeleteProviderCustomerCoupon,
} from "../../src/coupon/coupon.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForProvider() {
  await rawDeleteCity();
  await rawDeleteCategory();
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteProvider();
  await rawDeleteUser();
}
