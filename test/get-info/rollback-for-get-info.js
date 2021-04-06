import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForGetInfo() {
  await rawDeleteProvider();
  await rawDeleteCustomer();
  await rawDeleteUser();
}
