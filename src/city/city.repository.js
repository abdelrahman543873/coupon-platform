import { CityModel } from "./model/city.model.js";

export const addCityRepository = async (city) => {
  return await CityModel.create({ ...city, area: { coordinates: city.area } });
};

export const rawDeleteCity = async () => {
  return await CityModel.deleteMany({});
};

export const findPointCities = async (point) => {
  return await CityModel.find({
    area: {
      $geoIntersects: { $geometry: { type: "Point", coordinates: point } },
    },
    isActive: true,
  });
};
