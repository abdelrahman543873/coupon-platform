import { server } from "../src/server.js";
import dotenv from "dotenv";
import { connectDB } from "../src/db/dbConnection.js";
import admin from "firebase-admin";
import { serviceAccountConfig } from "../src/notification/service-account-file.js";

let app;
beforeAll(async () => {
  dotenv.config();
  jest.setTimeout(50000);
  await connectDB(process.env.COUPONAT_DB_URL_LOCAL);
  app = server.listen(process.env.COUPONAT_N_PORT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
});

afterAll(async (done) => {
  app.close(done);
});
