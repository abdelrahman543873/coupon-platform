import { rawDeleteContactUs } from "../../src/contact-us/contact-us.repository";
import { rawDeleteProvider } from "../../src/provider/provider.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForContactUs() {
  await rawDeleteProvider();
  await rawDeleteContactUs();
  await rawDeleteUser();
}
