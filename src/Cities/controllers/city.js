import boom from "@hapi/boom";
import { City } from "../../middlewares/responsHandler.js";
import { decodeToken } from "../../utils/JWTHelper.js";
import { CityModule } from "../modules/city.js";

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
    let auth = await decodeToken(req.headers.authentication),
      isAdmin = auth && auth.type == "ADMIN" ? true : null;
    let cities = await CityModule.getAll(isAdmin);

    cities = cities.map((city) => {
      return new City(city);
    });
    return res.status(200).send({
      isSuccessed: true,
      data: cities,
      error: null,
    });
  },

  async updateCity(req, res, next) {
    console.log("Hereeee");
    let id = req.params.id;
    let city = req.body;
    city = await CityModule.update(id, city);
    if (!city) {
      let errMsg =
        req.headers.lang == "en" ? "City not found" : "المدينة غير موجودة";
      return next(boom.notFound(errMsg));
    }

    if (city.err)
      return next(
        boom.badData(getErrorMessage(city.err, req.headers.lang || "ar"))
      );

    city = new City(city.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: city,
      error: null,
    });
  },

  async toggleCity(req, res, next) {
    let id = req.params.id;
    let city = await CityModule.switchCity(id);
    if (!city) {
      let errMsg =
        req.headers.lang == "en" ? "City not found" : "المدينة غير موجودة";
      return next(boom.notFound(errMsg));
    }

    return res.status(201).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },
};

export { CityController };
