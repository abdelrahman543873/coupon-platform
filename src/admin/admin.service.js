import {
  findProviderByUserId,
  getProvider,
  manageProviderStatusRepository,
  updateProviderRepository,
} from "../provider/provider.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import QRCode from "qrcode";
import {
  findProviderCouponsRepository,
  updateCouponsRepository,
} from "../coupon/coupon.repository.js";
import fs from "fs";
export const addAdminService = async (req, res, next) => {
  try {
    const existingUser = await findUserByEmailOrPhone(req.body);
    if (existingUser) throw new BaseHttpError(601);
    const user = await createUser({ ...req.body, role: UserRoleEnum[2] });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const manageProviderStatusService = async (req, res, next) => {
  try {
    const provider = await findProviderByUserId(req.body.provider);
    if (!provider) throw new BaseHttpError(617);
    const updatedProvider = await manageProviderStatusRepository(
      provider.user._id,
      !provider.isActive
    );
    const providerCoupons = await findProviderCouponsRepository(
      provider.user._id
    );
    let providerCouponsIds;
    !!providerCoupons.length &&
      (providerCouponsIds = providerCoupons.map((coupon) => {
        return coupon._id;
      }));
    providerCouponsIds &&
      (await updateCouponsRepository({
        ids: providerCouponsIds,
        value: { isActive: !provider.isActive },
      }));
    res.status(200).json({
      success: true,
      data: updatedProvider.isActive,
    });
  } catch (error) {
    next(error);
  }
};

export const generateProviderQrCodeService = async (req, res, next) => {
  try {
    const provider = await getProvider(req.body.provider);
    if (!provider) throw new BaseHttpError(625);
    const path = "./public/provider-qr-codes/";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    await QRCode.toFile(
      `${path}${provider.user}.png`,
      decodeURI(encodeURI(provider.user)),
      {
        type: "png",
        color: {
          dark: "#575757", // Blue dots
          light: "#0000", // Transparent background
        },
      }
    );
    const updatedProvider = await updateProviderRepository(provider.user, {
      qrURL: `${path}${provider.user}.png`,
    });
    res.status(200).json({
      success: true,
      data: updatedProvider,
    });
  } catch (error) {
    next(error);
  }
};
