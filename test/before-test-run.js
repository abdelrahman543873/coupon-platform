import { server } from "../src/server";
const app = () => {
  return server.listen(process.env.COUPONAT_N_PORT);
};
beforeAll(async () => {
  app();
});

afterAll(async (done) => {
  await app().close();
});
