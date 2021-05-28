import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";
import { serviceAccountConfig } from "../src/notification/service-account-file.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mongod = new MongoMemoryServer({
  autoStart: false,
});
const globalConfigPath = path.join(__dirname, "globalConfig.json");

export default async () => {
  dotenv.config();
  if (!mongod.getInstanceInfo()) {
    await mongod.start();
  }
  const dbUrl = await mongod.getUri();
  const mongoConfig = {
    mongoDBName: "jest",
    mongoUri: dbUrl,
  };
  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
};
