import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForProvider() {
  await rawDeleteProvider();
  await rawDeleteUser();
}
