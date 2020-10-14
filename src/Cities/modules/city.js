import { CityModel } from "../models/city";
import { modifyValuesByLang } from "../../utils/LanguageHelper";
import { DistrictModel } from "../models/district";

const CityModule = {
  async getAll(lang) {
    return await CityModel.find({})
      .lean()
      .then(async (cities) => {
        return cities;
      });
  },

  async getById(id) {
    return await CityModel.findById(id);
  },

  async getDistricts(city, lang) {
    return await DistrictModel.find({city})
      .lean()
      .then(async(districts) => {
        return districts;
      });
  },

  async addCity(name) {
    return await CityModel({
      name
    })
      .save()
      .then(docs=>{
        return {docs,err:null}
      })
      .catch((err) => {
        return {docs:null,err}
      });
  },

  async addDistricts(name,city) {
    // let city = await this.getById(id);
    // if (!city) return null;
    return await DistrictModel({name,city})
    .save()
    .then(docs=>{
      return {docs,err:null}
    })
    .catch((err) => {
      return {docs:null,err}
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
