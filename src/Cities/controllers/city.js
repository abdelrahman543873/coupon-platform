import boom from "@hapi/boom";
import { CityModule } from "../modules/city";

const CityController = {
  async addCity(req, res, next) {
    let name = req.body.name;
    let city = await CityModule.addCity(name);
    if (city.err) return next(boom.badData("Can not add city!"));
    return res.status(201).send({
      isSuccessed: true,
      data: city.docs,
      error: null,
    });
  },

  async addDistricts(req, res, next) {
    let name = req.body.name,
      city = req.params.city;
    let district = await CityModule.addDistricts(name, city);
    if (district.err) {
      console.log(district.err);
      return next(boom.notFound("Can not find city"));
    }
    return res.status(201).send({
      isSuccessed: true,
      data: district.docs,
      error: null,
    });
  },

  // async deleteDistrict(req, res, next) {
  //   let cityId = req.params.id,
  //     districtId = req.params.districtId,
  //     lang = req.headers.lang || "ar",
  //     city = await CityModule.getById(cityId);
  //   if (!city) {
  //     let errMgs = lang == "en" ? "City not found" : "المدينه غير موجوده";
  //     return next(boom.notFound(errMgs));
  //   }
  //   let districts = city.districts,
  //     deletedIndex = districts
  //       .map((district) => district._id)
  //       .indexOf(districtId);
  //   if (deletedIndex < 0) {
  //     let errMgs = lang == "en" ? "District not found" : "المنطقه غير موجوده";
  //     return next(boom.notFound(errMgs));
  //   }
  //   let newDistricts = districts
  //     .slice(0, deletedIndex)
  //     .concat(deletedIndex + 1, districts.length);

  //   city.districts = newDistricts;
  //   await city.save();
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: city,
  //     error: null,
  //   });
  // },

  // async deleteCity(req, res, next) {
  //   let cityId = req.params.id,
  //     lang = req.headers.lang || "ar";

  //   let city = await CityModule.getById(cityId);

  //   if (!city) {
  //     let errMsg = lang == "en" ? "City not found" : "المدينه غير موجوده";
  //     return next(boom.notFound(errMsg));
  //   }
  //   let deletingRes = await CityModule.deleteCity(cityId);
  //   if (!deletingRes) return next(boom.internal("error deleting city"));
  //   return res.status(200).send({
  //     isSuccessed: true,
  //     data: true,
  //     error: null,
  //   });
  // },

  async getCities(req, res, next) {
    let lang = req.headers.lang || "ar";
    console.log(lang);
    let cities = await CityModule.getAll(lang);
    return res.status(200).send({
      isSuccessed: true,
      data: cities,
      error: null,
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
      error: null,
    });
  },
};

export { CityController };
