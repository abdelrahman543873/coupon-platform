import { rawDeleteCustomer } from "../../src/customer/customer.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";
import { rawDeleteVerification } from "../../src/verification/verification.repository.js";

export async function rollbackDbForResetPassword() {
  await rawDeleteVerification();
  await rawDeleteProvider();
  await rawDeleteCustomer();
  await rawDeleteUser();
}
