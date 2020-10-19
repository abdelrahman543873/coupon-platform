require("dotenv").config();

import { connectDB } from "./src/db/dbConnection";
import { server } from "./src/server";

let dbUrl = process.env.COUPONAT_DB_URL_LOCAL;

if (process.env.RUN_INSIDE_DOCKER) {
  dbUrl = process.env.COUPONAT_DB_URL_COMPOSE;
}

connectDB(dbUrl)
  .then(() => {
    server.listen(process.env.COUPONAT_N_PORT, () => {
      console.log(
        "Couponat platform is running on port: " + process.env.COUPONAT_N_PORT
      );
    });
  })
  .catch(err => {
    console.log("Error: Couponat platform connection to database, " + err);
  });
