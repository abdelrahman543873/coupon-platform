import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForTesting() {
  await rawDeleteUser();
}
