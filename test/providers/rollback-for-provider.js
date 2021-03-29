import { rawDeleteProvider } from "../../src/provider/provider.repository";

export async function rollbackDbForProvider() {
  await rawDeleteProvider();
}
