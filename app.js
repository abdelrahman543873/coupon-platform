import { connectDB } from "./src/db/dbConnection.js";
import { server } from "./src/server.js";
import dotenv from "dotenv";

dotenv.config();
let dbUrl = process.env.RUN_INSIDE_DOCKER
  ? process.env.COUPONAT_DB_URL_COMPOSE
  : process.env.COUPONAT_DB_URL_LOCAL;
connectDB(dbUrl).then(() => {
  server.listen(process.env.COUPONAT_N_PORT, () => {
    console.log("coupons platform is running ");
  });
});
