import dotenv from "dotenv";
import admin from "firebase-admin";
import { serviceAccountConfig } from "../src/notification/service-account-file.js";
import { connectDB } from "../src/_common/dbConnection.js";
import mongoose from "mongoose";

jest.setTimeout(50000);
beforeAll(async () => {
  dotenv.config();
  await connectDB(global.__MONGO_URI__);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
});

afterAll(async () => {
  await mongoose.connection.close(true);
});
