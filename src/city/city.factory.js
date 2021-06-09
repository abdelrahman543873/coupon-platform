import faker from "faker";
import { type } from "./city.enum.js";
import { CityModel } from "./model/city.model.js";

export const buildCityParams = (obj = {}) => {
  const polygonPoints = [];
  for (let i = 0; i < 3; i++) {
    polygonPoints.push([+faker.address.longitude(), +faker.address.latitude()]);
  }
  return {
    enName: obj.enName || faker.datatype.uuid(),
    arName: obj.arName || faker.datatype.uuid(),
    area: obj.area || {
      coordinates: polygonPoints,
    },
    isActive: obj.isActive ?? true,
  };
};

export const citiesFactory = async (count = 10, obj = {}) => {
  const cities = [];
  for (let i = 0; i < count; i++) {
    const city = buildCityParams(obj);
    city.area.type = type[0];
    city.area.coordinates.push(city.area.coordinates[0]);
    city.area.coordinates = [city.area.coordinates];
    cities.push(city);
  }
  return await CityModel.collection.insertMany(cities);
};

export const cityFactory = async (obj = {}) => {
  const params = buildCityParams(obj);
  params.area.coordinates.push(params.area.coordinates[0]);
  return await CityModel.create(params);
};
