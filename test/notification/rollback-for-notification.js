import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";
import { rawDeleteNotification } from "../../src/notification/notification.repository.js";

export async function rollbackDbForNotification() {
  await rawDeleteNotification();
  await rawDeleteProvider();
  await rawDeleteUser();
}
