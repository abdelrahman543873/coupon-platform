import { rawDeleteCategory } from "../../src/category/category.repository";
import {
  rawDeleteCoupon,
  rawDeleteProviderCustomerCoupon,
} from "../../src/coupon/coupon.repository";
import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForAdmin() {
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteCategory();
  await rawDeleteProvider();
  await rawDeleteCustomer();
  await rawDeleteUser();
}