import { CityModel } from "../models/city";
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

  async addCity(name, location) {
    return await CityModel({
      name,
      location,
    })
      .save()
      .then((docs) => {
        return { docs, err: null };
      })
      .catch((err) => {
        return { docs: null, err };
      });
  },
};

export { CityModule };
