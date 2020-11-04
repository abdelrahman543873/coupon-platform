import { CityModel } from "../models/city";
import { DistrictModel } from "../models/district";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper";

const CityModule = {
  async getAll() {
    return await CityModel.find({})
      .lean()
      .then(async (cities) => {
        return cities;
      });
  },

  async getById(id) {
    if (!checkAllMongooseId(id)) return null;
    return await CityModel.findById(id);
  },

  async getDistricts(city) {
    if (!checkAllMongooseId(city)) return null;
    return await DistrictModel.find({ city })
      .lean()
      .then(async (districts) => {
        return districts;
      });
  },

  async addCity(name) {
    return await CityModel({
      name,
    })
      .save()
      .then((docs) => {
        return { docs, err: null };
      })
      .catch((err) => {
        return { docs: null, err };
      });
  },

  async addDistricts(name, city) {
    if (!checkAllMongooseId(city)) return null;
    return await DistrictModel({ name, city })
      .save()
      .then((docs) => {
        return { docs, err: null };
      })
      .catch((err) => {
        return { docs: null, err };
      });
  },

  // async deleteCity(cityId) {
  //   return await CityModel.deleteOne({ _id: cityId }).catch((err) => {
  //     console.log(err);
  //     return null;
  //   });
  // },
};

export { CityModule };
