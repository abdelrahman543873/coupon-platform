import cors from "cors";
import { errorHandling } from "./middlewares/errorHandler.js";
import { router } from "./routes/app.routes.js";
import express from "express";
import "reflect-metadata";
let server = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204

};
server.use(cors(corsOptions)); // for application/x-www-form-urlencoded requests

server.use(express.urlencoded({
  extended: true
})); // for application/json requests

server.use(express.json());
server.use("/app", (req, res, next) => {
  let agent = req.headers["user-agent"];
  console.log(agent);
  if (agent.includes("iPhone;") || agent.includes("iPhone")) res.redirect("https://apps.apple.com/us/app/كوبونات-المدينه/id1539424240");else if (agent.includes("Android")) res.redirect("https://play.google.com/store/apps/details?id=com.alef.couponalmadena");else res.redirect("https://play.google.com/store/apps/details?id=com.alef.couponsalmadena");
});
server.use(router);
server.use("/api/v1/PrivacyPolicy", express.static("assets/puplic")); // route not found fallback

server.all("*", (req, res, next) => {
  res.status(404).send("not found!!");
}); // Error handler middleware.

server.use(errorHandling);
export { server };