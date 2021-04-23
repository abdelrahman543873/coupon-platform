import { rawDeleteCategory } from "../../src/category/category.repository";
import { rawDeleteCity } from "../../src/city/city.repository";
import { rawDeleteContactUs } from "../../src/contact-us/contact-us.repository";
import { rawDeleteCoupon } from "../../src/coupon/coupon.repository";
import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeletePayments } from "../../src/payment/payment.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";
import { rawDeleteBank } from "../../src/bank/bank.repository";
import { rawDeleteCredit } from "../../src/credit/credit.repository";
import { rawDeleteProviderCustomerCoupon } from "../../src/subscription/subscription.repository.js";
export async function rollbackDbForAdmin() {
  await rawDeleteCredit();
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
