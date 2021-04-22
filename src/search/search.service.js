import { searchCouponsRepository } from "../coupon/coupon.repository.js";
import { getCustomerRepository } from "../customer/customer.repository.js";
import { getCustomerSubscribedCoupons } from "../subscription/subscription.repository.js";
import { searchProvidersRepository } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";

export const searchCouponsService = async (req, res, next) => {
  try {
    const searchResult = await searchCouponsRepository(
      req.query.category,
      req.query.provider,
      req.query.offset,
      req.query.limit,
      req.currentUser,
      req.query.name
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
