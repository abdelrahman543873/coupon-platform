import { CityModel } from "./model/city.model.js";

export const addCityRepository = async (city) => {
  return await CityModel.create({ ...city, area: { coordinates: city.area } });
};

export const rawDeleteCity = async () => {
  return await CityModel.deleteMany({});
};
