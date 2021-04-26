import { type } from "./city.enum.js";
import { CityModel } from "./model/city.model.js";

export const addCityRepository = async (city) => {
  return await CityModel.create({ ...city, area: { coordinates: city.area } });
};

export const getCitiesRepository = async (offset = 0, limit = 15) => {
  return await CityModel.paginate(
    {},
    { offset: offset * limit, limit, sort: "-createdAt", lean: true }
  );
};

export const findCityRepository = async ({ _id }) => {
  return await CityModel.findOne({ _id }, {}, { lean: true });
};

export const rawDeleteCity = async () => {
  return await CityModel.deleteMany({});
};

export const updateCityRepository = async ({ _id, city }) => {
  return await CityModel.findOneAndUpdate(
    { _id },
    { ...city, ...(city.area && { area: { coordinates: city.area } }) },
    { lean: true, new: true }
  );
};

export const findPointCities = async (point) => {
  return await CityModel.findOne({
    area: {
      $geoIntersects: { $geometry: { type: type[1], coordinates: point } },
    },
    isActive: true,
  });
};

export const findPointsCities = async (coordinates) => {
  return await CityModel.find({
    area: {
      $geoIntersects: { $geometry: { type: type[2], coordinates } },
    },
    isActive: true,
  });
};
