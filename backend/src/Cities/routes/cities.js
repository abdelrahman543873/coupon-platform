import { Router } from "express";
import { cityValidationware } from "../middlewares/validations/city";
import { CityController } from "../controllers/city";

const citiesRouter = Router();

citiesRouter
  .route("/")
  .get(CityController.getCities);

// citiesRouter
//   .route("/:id/districts/:districtId")
//   .delete(AdminCityControllers.deleteDistrict);

citiesRouter
  .route("/:id/districts")
  .get(CityController.getDistricts);

export { citiesRouter };
