import { CityModel } from "../models/city.js";
import { checkAllMongooseId } from "../../utils/mongooseIdHelper.js";

const CityModule = {
  async getAll(isAdmin) {
    let queryOp = {};
    if (!isAdmin) queryOp.isActive = true;
    return await CityModel.find({ ...queryOp })
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

  async update(id, newData) {
    if (!checkAllMongooseId(id)) return null;
    return await CityModel.findByIdAndUpdate(
      id,
      { $set: { ...newData } },
      { new: true }
    )
      .then((doc) => {
        return {
          doc: doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err: err,
        };
      });
  },

  async switchCity(id) {
    if (!checkAllMongooseId(id)) return null;
    let city = await CityModel.findById(id);
    if (!city) return null;
    city.isActive = !city.isActive;
    city = await city.save();
    return city;
  },
};

export { CityModule };
