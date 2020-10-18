import { CityModule } from "../../modules/city";

const GeneralCityControllers = {
  async getCities(req, res, next) {
    let lang = req.headers.lang || "ar";
    let cities = await CityModule.getAll(lang);
    return res.status(200).send({
      isSuccessed: true,
      data: cities,
      error: null
    });
  },
  async getDistricts(req, res, next) {
    let cityId = req.params.id;
    let districts = await CityModule.getDistricts(
      cityId,
      req.headers.lang || "ar"
    );
    return res.status(200).send({
      isSuccessed: true,
      data: districts,
      error: null
    });
  }
};

export { GeneralCityControllers };
