import { connectDB } from "./src/db/dbConnection.js";
import { server } from "./src/server.js";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { serviceAccountConfig } from "./src/notification/service-account-file.js";
dotenv.config();

let dbUrl = process.env.RUN_INSIDE_DOCKER
  ? process.env.COUPONAT_DB_URL_COMPOSE
  : process.env.COUPONAT_DB_URL_LOCAL;
await connectDB(dbUrl);
await server.listen(process.env.COUPONAT_N_PORT, () => {
  console.log("coupons platform is running ");
});
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
