import cors from "cors";
import { router } from "./routes/app.routes.js";
import express from "express";
import { handleError } from "./_common/error-handling-module/error-handler.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { options } from "../swagger.js";
let server = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const swaggerSpec = swaggerJSDoc(options);

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

// server.use("/app", (req, res, next) => {
//   let agent = req.headers["user-agent"];
//   console.log(agent);
//   if (agent.includes("iPhone;") || agent.includes("iPhone"))
//     res.redirect("https://apps.apple.com/us/app/كوبونات-المدينه/id1539424240");
//   else if (agent.includes("Android"))
//     res.redirect(
//       "https://play.google.com/store/apps/details?id=com.alef.couponalmadena"
//     );
//   else
//     res.redirect(
//       "https://play.google.com/store/apps/details?id=com.alef.couponsalmadena"
//     );
// });
