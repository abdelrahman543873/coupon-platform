import cors from "cors";
import { router } from "./routes/app.routes.js";
import express from "express";
import { handleError } from "./_common/error-handling-module/error-handler.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { options } from "../swagger.js";
import rateLimit from "express-rate-limit";
import responseTime from "response-time";

const server = express();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const swaggerSpec = swaggerJSDoc(options);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});
server.use(responseTime());
server.use(limiter);
//used for documenting the api using swagger ui
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(cors(corsOptions));

// for application/x-www-form-urlencoded requests
server.use(express.urlencoded({ extended: true }));

// for application/json requests
server.use(express.json());

server.use(router);

server.use("/public", express.static("./public"));

// route not found fallback
server.all("*", (req, res, next) => {
  res.status(404).send("not found!!");
});

server.use(handleError);

export { server };
