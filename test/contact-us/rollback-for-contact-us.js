import { rawDeleteContactUs } from "../../src/contact-us/contact-us.repository";
import { rawDeleteUser } from "../../src/user/user.repository";

export async function rollbackDbForContactUs() {
  await rawDeleteContactUs();
  await rawDeleteUser();
}
