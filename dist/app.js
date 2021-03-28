"use strict";

var _subscription = require("./src/Purchasing/models/subscription.js");

var _subscription2 = require("./src/Purchasing/modules/subscription.js");

var _dbConnection = require("./src/db/dbConnection.js");

var _server = require("./src/server.js");

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var dbUrl = process.env.COUPONAT_DB_URL_LOCAL;

if (process.env.RUN_INSIDE_DOCKER) {
  dbUrl = process.env.COUPONAT_DB_URL_COMPOSE;
}

console.log(dbUrl);
(0, _dbConnection.connectDB)(dbUrl).then(function () {
  _server.server.listen(process.env.COUPONAT_N_PORT, function () {
    console.log("Couponat platform is running on port: " + process.env.COUPONAT_N_PORT);
  });

  _nodeCron["default"].schedule("0 0 */4 * * *", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var date, subscriptions, subscriptionsId, i, deleteSub;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Here now");
            date = new Date(new Date().setDate(new Date().getDate() - 7));
            _context.next = 4;
            return _subscription.SubscripionModel.find({
              isConfirmed: true,
              isPaid: false,
              isUsed: false,
              createdAt: {
                $lte: date
              }
            }, {
              _id: 1
            });

          case 4:
            subscriptions = _context.sent;
            subscriptionsId = [];

            for (i = 0; i < subscriptions.length; i++) {
              console.log(subscriptions[i]._id);
              subscriptionsId.push(subscriptions[i]._id + "");
            }

            console.log("data: ", subscriptionsId);
            _context.next = 10;
            return _subscription2.subscriptionModule["delete"](subscriptionsId);

          case 10:
            deleteSub = _context.sent;

            if (deleteSub.err) {
              console.log(err);
            } else if (deleteSub.doc) {
              console.log(deleteSub.doc);
            }

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
})["catch"](function (err) {
  console.log("Error: Couponat platform connection to database, " + err);
});