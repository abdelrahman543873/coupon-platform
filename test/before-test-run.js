import { server } from "../src/server.js";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { serviceAccountConfig } from "../src/notification/service-account-file.js";
import { connectDB } from "../src/_common/dbConnection.js";
import mongoose from "mongoose";
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

afterAll(async () => {
  await mongoose.connection.close(true);
  app.close();
});
