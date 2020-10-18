import boom from "@hapi/boom";
import { CityModule } from "../../modules/city";

const AdminCityControllers = {
  async addCity(req, res, next) {
    let name = req.body.name;
    let city = await CityModule.addCity(name);
    if (!city) return next(boom.badData("Can not add city!"));
    return res.status(201).send({
      isSuccessed: true,
      data: city,
      error: null,
    });
  },
  async addDistricts(req, res, next) {
    let districts = req.body.districts,
      cityId = req.params.id;
    let city = await CityModule.addDistricts(cityId, districts);
    if (!city) return next(boom.notFound("Can not find city"));
    return res.status(201).send({
      isSuccessed: true,
      data: city,
      error: null,
    });
  },
  async deleteDistrict(req, res, next) {
    let cityId = req.params.id,
      districtId = req.params.districtId,
      lang = req.headers.lang || "ar",
      city = await CityModule.getById(cityId);
    if (!city) {
      let errMgs = lang == "en" ? "City not found" : "المدينه غير موجوده";
      return next(boom.notFound(errMgs));
    }
    let districts = city.districts,
      deletedIndex = districts
        .map((district) => district._id)
        .indexOf(districtId);
    if (deletedIndex < 0) {
      let errMgs = lang == "en" ? "District not found" : "المنطقه غير موجوده";
      return next(boom.notFound(errMgs));
    }
    let newDistricts = districts
      .slice(0, deletedIndex)
      .concat(deletedIndex + 1, districts.length);

    city.districts = newDistricts;
    await city.save();
    return res.status(200).send({
      isSuccessed: true,
      data: city,
      error: null,
    });
  },
  async deleteCity(req, res, next) {
    let cityId = req.params.id,
      lang = req.headers.lang || "ar";

    let city = await CityModule.getById(cityId);

    if (!city) {
      let errMsg = lang == "en" ? "City not found" : "المدينه غير موجوده";
      return next(boom.notFound(errMsg));
    }
    let deletingRes = await CityModule.deleteCity(cityId);
    if (!deletingRes) return next(boom.internal("error deleting city"));
    return res.status(200).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },
};

export { AdminCityControllers };
