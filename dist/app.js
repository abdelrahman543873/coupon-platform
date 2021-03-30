function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import { SubscripionModel } from "./src/Purchasing/models/subscription.js";
import { subscriptionModule } from "./src/Purchasing/modules/subscription.js";
import { connectDB } from "./src/db/dbConnection.js";
import { server } from "./src/server.js";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();
var dbUrl = process.env.RUN_INSIDE_DOCKER ? process.env.COUPONAT_DB_URL_COMPOSE : process.env.COUPONAT_DB_URL_LOCAL;
connectDB(dbUrl).then(() => {
  server.listen(process.env.COUPONAT_N_PORT, () => {
    console.log("Couponat platform is running on port: " + process.env.COUPONAT_N_PORT);
  });
  cron.schedule("0 0 */4 * * *", /*#__PURE__*/_asyncToGenerator(function* () {
    console.log("Here now");
    var date = new Date(new Date().setDate(new Date().getDate() - 7));
    var subscriptions = yield SubscripionModel.find({
      isConfirmed: true,
      isPaid: false,
      isUsed: false,
      createdAt: {
        $lte: date
      }
    }, {
      _id: 1
    });
    var subscriptionsId = [];

    for (var i = 0; i < subscriptions.length; i++) {
      console.log(subscriptions[i]._id);
      subscriptionsId.push(subscriptions[i]._id + "");
    }

    console.log("data: ", subscriptionsId);
    var deleteSub = yield subscriptionModule.delete(subscriptionsId);

    if (deleteSub.err) {
      console.log(err);
    } else if (deleteSub.doc) {
      console.log(deleteSub.doc);
    }
  }));
}).catch(err => {
  console.log("Error: Couponat platform connection to database, " + err);
});