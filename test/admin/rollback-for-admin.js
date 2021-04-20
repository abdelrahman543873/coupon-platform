import { rawDeleteCategory } from "../../src/category/category.repository";
import { rawDeleteCity } from "../../src/city/city.repository";
import { rawDeleteContactUs } from "../../src/contact-us/contact-us.repository";
import {
  rawDeleteCoupon,
  rawDeleteProviderCustomerCoupon,
} from "../../src/coupon/coupon.repository";
import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeletePayments } from "../../src/payment/payment.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";
import { rawDeleteBank } from "../../src/bank/bank.repository";
export async function rollbackDbForAdmin() {
  await rawDeleteBank();
  await rawDeleteCity();
  await rawDeletePayments();
  await rawDeleteContactUs();
  await rawDeleteProviderCustomerCoupon();
  await rawDeleteCoupon();
  await rawDeleteCategory();
  await rawDeleteProvider();
  await rawDeleteCustomer();
  await rawDeleteUser();
}
