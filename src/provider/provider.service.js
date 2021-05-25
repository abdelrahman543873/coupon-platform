import {
  addCouponRepository,
  findCouponByIdAndProvider,
  getMyCouponsRepository,
  updateCoupon,
  getCoupon,
} from "../coupon/coupon.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import {
  addVerificationCode,
  verifyOTPRepository,
} from "../verification/verification.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { createVerificationCode } from "../_common/helpers/smsOTP.js";
import { sendMessage } from "../_common/helpers/twilio.js";
import {
  deleteProviderLocation,
  findProviderByEmailForLogin,
  findProviderById,
  getCustomerProvidersRepository,
  getProviderLocationsRepository,
  getProviders,
  providerRegisterRepository,
  updateProviderRepository,
} from "./provider.repository.js";
import { deleteCoupon } from "../coupon/coupon.repository.js";
import { findCategoryRepository } from "../category/category.repository.js";
import { findPointCities } from "../city/city.repository.js";
import { getRecentlySoldCouponsRepository } from "../../src/subscription/subscription.repository.js";
import { formattedGeo } from "../_common/helpers/geo-encoder.js";
import { notifyUsers } from "../notification/notification.service.js";
import { NewCouponMessage } from "../notification/notification.enum.js";
import { bcryptCheckPass } from "../_common/helpers/bcryptHelper.js";
import { generateToken } from "../_common/helpers/jwt-helper.js";
import polylabel from "polylabel";

export const providerRegisterService = async (req, res, next) => {
  try {
    const existingUser = await findProviderByEmailForLogin({
      provider: req.body,
    });
    if (existingUser) throw new BaseHttpError(601);
    const provider = await providerRegisterRepository({
      role: UserRoleEnum[0],
      ...req.body,
    });
    const verificationCode = await addVerificationCode({
      ...createVerificationCode(),
      user: provider._id,
      email: provider.email,
    });
    await sendMessage({
      to: req.body.phone,
      text: verificationCode.code,
    });
    return res.status(201).json({
      success: true,
      data: {
        user: {
          ...(await findProviderById(provider._id)),
        },
        authToken: generateToken(provider._id, "PROVIDER"),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderService = async (req, res, next) => {
  try {
    const provider = await findProviderById(req.currentUser.id);
    return res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderService = async (req, res, next) => {
  try {
    const passwordValidation = req.body.password
      ? await bcryptCheckPass(req.body.password, req.currentUser.password)
      : true;
    if (!passwordValidation) throw new BaseHttpError(607);
    if (req.body.verificationCode) {
      const verification = await verifyOTPRepository({
        code: req.body.verificationCode,
        email: req.currentUser.email,
      });
      if (!verification) throw new BaseHttpError(617);
    }
    const user = await updateProviderRepository(req.currentUser._id, {
      ...req.body,
      image: req.file,
    });
    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCouponsService = async (req, res, next) => {
  try {
    let data;
    const sold =
      req.query.sold == "true"
        ? true
        : req.query.sold == "false"
        ? false
        : undefined;
    req.query.recentlySold == "true" &&
      (data = await getRecentlySoldCouponsRepository(
        req.currentUser._id,
        req.query.offset,
        req.query.limit,
        req.query.categoryId,
        sold
      ));
    !data &&
      (data = await getMyCouponsRepository(
        req.currentUser._id,
        req.query.categoryId,
        req.query.offset,
        req.query.limit,
        sold
      ));
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const addCouponService = async (req, res, next) => {
  try {
    const category = await findCategoryRepository(req.body.category);
    if (!category) throw new BaseHttpError(638);
    const coupon = await addCouponRepository({
      ...req.body,
      logoURL: req.file,
      provider: req.currentUser._id,
    });
    await notifyUsers(NewCouponMessage(coupon, req.currentUser));
    return res.status(200).json({
      success: true,
      data: await getCoupon({ _id: coupon.id }),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCouponService = async (req, res, next) => {
  try {
    const coupon = await findCouponByIdAndProvider(
      req.body.coupon,
      req.currentUser._id
    );
    if (!coupon) throw new BaseHttpError(618);
    const deletedCoupon = await deleteCoupon(coupon.id);
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCouponService = async (req, res, next) => {
  try {
    const coupon = await findCouponByIdAndProvider(
      req.body.coupon,
      req.currentUser._id
    );
    if (!coupon) throw new BaseHttpError(618);
    const updatedCoupon = await updateCoupon(coupon._id, req.currentUser._id, {
      ...req.body,
      logoURL: req.file,
    });
    res.status(200).json({
      success: true,
      data: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

export const getProvidersService = async (req, res, next) => {
  try {
    const providers = await getProviders(req.query.offset, req.query.limit);
    res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerProvidersService = async (req, res, next) => {
  try {
    const providers = await getCustomerProvidersRepository(
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

export const addLocationService = async (req, res, next) => {
  try {
    const city = await findPointCities([req.body.long, req.body.lat]);
    if (!city) throw new BaseHttpError(639);
    const duplicatedLocation =
      await req.currentUser.locations.coordinates.filter((coordinate) => {
        return coordinate[0] == req.body.long && coordinate[1] == req.body.lat;
      });
    if (duplicatedLocation.length) throw new BaseHttpError(644);
    // to allow the same function to work for both admin and provider
    const provider = await updateProviderRepository(
      req.body.provider || req.currentUser._id,
      {
        // created like this not to cause conflicts with locations value in the
        // model if it were to be place inside the updateProviderRepository
        // when expanding the object
        $addToSet: {
          "locations.coordinates": [req.body.long, req.body.lat],
          metaData: await formattedGeo({
            enName: city.enName,
            arName: city.arName,
            lat: req.body.lat,
            lon: req.body.long,
            center: polylabel(city.area.coordinates),
          }),
        },
      }
    );
    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const addLocationsService = async (req, res, next) => {
  try {
    const convertedLocations = [];
    for (let i = 0; i < req.body.locations.length; i++) {
      const city = await findPointCities(req.body.locations[i]);
      if (!city) throw new BaseHttpError(639);
      const formattedAddress = await formattedGeo({
        enName: city.enName,
        arName: city.arName,
        lat: req.body.locations[i][1],
        lon: req.body.locations[i][0],
        center: polylabel(city.area.coordinates),
      });
      convertedLocations.push(formattedAddress);
    }
    const provider = await updateProviderRepository(req.body.provider, {
      $addToSet: {
        "locations.coordinates": { $each: req.body.locations },
        metaData: { $each: convertedLocations },
      },
    });
    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLocationService = async (req, res, next) => {
  try {
    // this is done to fit a provider and admin query
    const locations =
      req.currentUser.locations ||
      (await findProviderById(req.body.provider)).locations;
    if (locations.coordinates.length === 1) throw new BaseHttpError(653);
    const filteredLocations = locations.coordinates.filter(
      (location) =>
        location[0] === req.body.long && location[1] === req.body.lat
    );
    if (filteredLocations.length === 0) throw new BaseHttpError(647);
    await deleteProviderLocation({
      _id: req.body.provider || req.currentUser._id,
      location: filteredLocations[0],
    });
    res.status(200).json({
      success: true,
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderLocationsService = async (req, res, next) => {
  try {
    const locations = await getProviderLocationsRepository({
      _id: req.query.provider,
    });
    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};
