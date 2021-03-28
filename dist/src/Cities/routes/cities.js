import { Router } from "express";
import { CityController } from "../controllers/city.js";
const citiesRouter = Router();
citiesRouter.route("/").get(CityController.getCities);
export { citiesRouter };