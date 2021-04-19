import { searchCouponsRepository } from "../coupon/coupon.repository.js";
import { searchProvidersRepository } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";

export const searchCouponsService = async (req, res, next) => {
  try {
    if (!req.query.name) throw new BaseHttpError(620);
    const searchResult = await searchCouponsRepository(
      req.query.name,
      req.query.offset,
      req.query.limit,
      req.query.category
    );
    res.status(200).json({
      success: true,
      data: searchResult,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProviderService = async (req, res, next) => {
  try {
    if (!req.query.name) throw new BaseHttpError(620);
    const searchResult = await searchProvidersRepository(
      req.query.name,
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: searchResult,
    });
  } catch (error) {
    next(error);
  }
};
