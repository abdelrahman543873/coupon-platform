import express from "express";
import { CityController } from "../controllers/city.js";

const citiesRouter = express.Router();

citiesRouter.route("/").get(CityController.getCities);
export { citiesRouter };
