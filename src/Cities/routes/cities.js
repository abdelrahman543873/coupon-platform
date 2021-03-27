import { Router } from "express";
import { cityValidationware } from "../middlewares/validations/city";
import { CityController } from "../controllers/city";

const citiesRouter = Router();

citiesRouter.route("/").get(CityController.getCities);
export { citiesRouter };
