import { rawDeleteUser } from "../../src/user/user.repository";
import { rawDeleteCity } from "../../src/city/city.repository.js";

export async function rollbackDbForCity() {
  await rawDeleteCity();
  await rawDeleteUser();
}
