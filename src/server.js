import express from "express";
require("express-async-errors"); // wrap async errors within the app.
import cors from "cors";
import { errorHandling } from "./middlewares/errorHandler";
import { router } from "./routes";
import { attachSocketIO } from "./chat/socket.io";
const http = require("http");

let server = express(),
  corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
let serverApp = http.createServer(server);
//console.log(serverApp);
server.use(cors(corsOptions));

// for application/x-www-form-urlencoded requests
server.use(express.urlencoded({ extended: true }));

// for application/json requests
server.use(express.json());

server.use("/api/v1", router);

server.use("/api/v1/chat/chat-images", express.static("Chat-Images"));

// route not found fallback
server.all("*", (req, res, next) => {
  res.status(404).send("not found!!");
});

// Error handler middleware.
server.use(errorHandling);

console.log(__dirname);
serverApp = attachSocketIO(serverApp);

export { serverApp };
