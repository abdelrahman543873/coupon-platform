import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForCustomer() {
  await rawDeleteCustomer();
  await rawDeleteUser();
}
