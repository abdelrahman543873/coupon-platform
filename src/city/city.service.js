import { addCityRepository } from "./city.repository.js";

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
