import mongoose from "mongoose";
import server from "../src/server.js";
const app = () => {
  return server.listen(process.env.COUPONAT_N_PORT);
};
beforeAll(async () => {
  app();
});

afterAll(async (done) => {
  app().close();
  mongoose.disconnect(done);
});
