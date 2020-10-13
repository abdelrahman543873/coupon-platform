import { Router } from "express";
import { cityValidationware } from "../middlewares/validations/city";
import { CityController } from "../controllers/city";

const citiesRouter = Router();

citiesRouter
  .route("/")
  .post(cityValidationware.addCity, CityController.addCity)
  .get(CityController.getCities);

// citiesRouter
//   .route("/:id/districts/:districtId")
//   .delete(AdminCityControllers.deleteDistrict);

citiesRouter
  .route("/:id/districts")
  .post(cityValidationware.addDistricts, CityController.addDistricts)
  .get(CityController.getDistricts);

export { citiesRouter };
