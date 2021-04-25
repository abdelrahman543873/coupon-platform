import {
  addCityRepository,
  findCityRepository,
  getCitiesRepository,
  updateCityRepository,
} from "./city.repository.js";
import polylabel from "polylabel";

export const addCityService = async (req, res, next) => {
  try {
    // polygon shapes must be enclosed with the same point at the beggaring
    req.body.area.push(req.body.area[0]);
    const city = await addCityRepository(req.body);
    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

export const getCitiesService = async (req, res, next) => {
  try {
    const cities = await getCitiesRepository(req.body);
    cities.docs.forEach((city) => {
      const center = polylabel(city.area.coordinates);
      city.center = { long: center[0], lat: center[1] };
    });
    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCityService = async (req, res, next) => {
  try {
    // polygon shapes must be enclosed with the same point at the beggaring
    req.body?.area && req.body.area.push(req.body.area[0]);
    const city = await updateCityRepository({
      _id: req.body.city,
      city: req.body,
    });
    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCityService = async (req, res, next) => {
  try {
    const city = await findCityRepository({ _id: req.body.city });
    const updatedCity = await updateCityRepository({
      _id: city._id,
      city: { isActive: !city.isActive },
    });
    res.status(200).json({
      success: true,
      data: updatedCity,
    });
  } catch (error) {
    next(error);
  }
};
