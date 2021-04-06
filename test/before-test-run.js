import mongoose from "mongoose";
import { server } from "../src/server.js";
import dotenv from "dotenv";
let app;
beforeAll(async () => {
  dotenv.config();
  jest.setTimeout(50000);
  const mongo = await mongoose.connect(process.env.COUPONAT_DB_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  app = server.listen(process.env.COUPONAT_N_PORT);
});

afterAll(async (done) => {
  app.close(done);
  mongoose.disconnect(done);
});
