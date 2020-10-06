import { CityModel } from "../models/city";
import { modifyValuesByLang } from "../../utils/LanguageHelper";

const CityModule = {
  async getAll(lang) {
    return await CityModel.find({})
      .select("-districts")
      .lean()
      .then(async (cities) => {
        cities = await modifyValuesByLang(cities, "name", lang);
        return cities;
      });
  },
  async getById(id) {
    return await CityModel.findById(id);
  },
  async getDistricts(cityId, lang) {
    return await CityModel.findById(cityId)
      .select("districts -_id")
      .lean()
      .then((city) => {
        if (city && city.districts.length > 0)
          return modifyValuesByLang(city.districts, "name", lang);
        return [];
      });
  },
  async addCity(name) {
    return await CityModel({
      name,
    })
      .save()
      .catch((err) => {
        console.log(err);
        return null;
      });
  },
  async addDistricts(id, districts) {
    let city = await this.getById(id);
    if (!city) return null;
    city.districts.push(...districts);
    return await city.save().catch((err) => {
      console.log(err);
      return null;
    });
  },
  async deleteCity(cityId) {
    return await CityModel.deleteOne({ _id: cityId }).catch((err) => {
      console.log(err);
      return null;
    });
  },
};

export { CityModule };
