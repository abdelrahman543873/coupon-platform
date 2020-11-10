import boom from "@hapi/boom";
import { City } from "../../middlewares/responsHandler";
import { CityModule } from "../modules/city";

const CityController = {
  async addCity(req, res, next) {
    let { name, location } = req.body;
    let city = await CityModule.addCity(name, location);
    if (city.err) return next(boom.badData("Can not add city!"));
    city = new City(city.docs);
    return res.status(201).send({
      isSuccessed: true,
      data: city,
      error: null,
    });
  },

  async getCities(req, res, next) {
    let lang = req.headers.lang || "ar";
    console.log(lang);
    let cities = await CityModule.getAll(lang);
    cities = cities.map((city) => {
      return new City(city);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: cities,
      error: null,
    });
  },
};

export { CityController };
