import { SubscripionModel } from "./src/Purchasing/models/subscription.js";
import { subscriptionModule } from "./src/Purchasing/modules/subscription.js";
import { connectDB } from "./src/db/dbConnection.js";
import { server } from "./src/server.js";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();
let dbUrl = process.env.RUN_INSIDE_DOCKER
  ? process.env.COUPONAT_DB_URL_LOCAL
  : process.env.COUPONAT_DB_URL_COMPOSE;
console.log(dbUrl);

connectDB(dbUrl)
  .then(() => {
    server.listen(process.env.COUPONAT_N_PORT, () => {
      console.log(
        "Couponat platform is running on port: " + process.env.COUPONAT_N_PORT
      );
    });
    cron.schedule("0 0 */4 * * *", async () => {
      console.log("Here now");
      let date = new Date(new Date().setDate(new Date().getDate() - 7));
      let subscriptions = await SubscripionModel.find(
        {
          isConfirmed: true,
          isPaid: false,
          isUsed: false,
          createdAt: { $lte: date },
        },
        { _id: 1 }
      );

      let subscriptionsId = [];
      for (let i = 0; i < subscriptions.length; i++) {
        console.log(subscriptions[i]._id);
        subscriptionsId.push(subscriptions[i]._id + "");
      }
      console.log("data: ", subscriptionsId);
      let deleteSub = await subscriptionModule.delete(subscriptionsId);
      if (deleteSub.err) {
        console.log(err);
      } else if (deleteSub.doc) {
        console.log(deleteSub.doc);
      }
    });
  })
  .catch((err) => {
    console.log("Error: Couponat platform connection to database, " + err);
  });
