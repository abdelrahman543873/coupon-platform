require("dotenv").config();

import { connectDB } from "./src/db/dbConnection";
import { server } from "./src/server";

let dbUrl = process.env.COUPONAT_N_PORT;
import cron from "node-cron";
import { SubscripionModel } from "./src/Purchasing/models/subscription";
import { subscriptionModule } from "./src/Purchasing/modules/subscription";
// let deleteSubscriptions = cron.schedule("59 23 * * *", async () => {
//   let date = new Date(new Date().setDate(new Date().getDate() - 1));
//   let subscriptions = await SubscripionModel.find(
//     {
//       isConfirmed: true,
//       isPaid: false,
//       isUsed: false,
//       createdAt: { $lte: date },
//     },
//     { _id: 1 }
//   );

//   let subscriptionsId = [];
//   for (let i = 0; i < subscriptions; i++) {
//     subscriptionsId.push(subscriptions[i]._id);
//   }

//   await subscriptionModule.delete(subscriptionsId);
// });
if (process.env.RUN_INSIDE_DOCKER) {
  dbUrl = process.env.COUPONAT_DB_URL_COMPOSE;
}
console.log(dbUrl);
connectDB(dbUrl)
  .then(() => {
    server.listen(process.env.COUPONAT_N_PORT, () => {
      console.log(
        "Couponat platform is running on port: " + process.env.COUPONAT_N_PORT
      );
    });
    cron.schedule("59 23 * * *", async () => {
      console.log("Here now");
      let date = new Date(new Date().setDate(new Date().getDate() - 1));
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
