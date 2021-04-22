import {
  adminDeleteProviderRepository,
  countProvidersRepository,
  findProviderById,
  getProvider,
  manageProviderStatusRepository,
  updateProviderRepository,
  getAllProvidersWithQrUrlRepository,
} from "../provider/provider.repository.js";
import { UserRoleEnum } from "../user/user-role.enum.js";
import { createUser, findUserByEmailOrPhone } from "../user/user.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import QRCode from "qrcode";
import {
  countCouponsRepository,
  deleteCoupon,
  deleteProviderCouponsRepository,
  findCouponByCategory,
  findProviderCouponsRepository,
  updateCouponsRepository,
} from "../coupon/coupon.repository.js";
import fs from "fs";
import { deleteCategory } from "../category/category.repository.js";
import {
  checkIfCouponWasSold,
  countSubscriptionsRepository,
  getProviderSoldCoupons,
} from "../subscription/subscription.repository.js";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";

dotenv.config();
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
    const provider = await findProviderById(req.body.provider);
    if (!provider) throw new BaseHttpError(617);
    let qrURL;
    if (!provider.qrURL) {
      const path = "public/provider-qr-codes/";
      // this is done so that we can have an online url in the manage manageProviderStatusRepository
      // and be able to create the directory if it doesn't exist on the server
      if (!fs.existsSync(`./${path}`)) {
        fs.mkdirSync(path);
      }
      await QRCode.toFile(
        //here the same issue
        `./${path}${provider.code}.png`,
        decodeURI(encodeURI(provider.code)),
        {
          type: "png",
          color: {
            dark: "#575757", // Blue dots
            light: "#0000", // Transparent background
          },
        }
      );
      qrURL = `${path}${provider.code}.png`;
    }
    const updatedProvider = await manageProviderStatusRepository(
      provider._id,
      !provider.isActive,
      qrURL
    );
    const providerCoupons = await findProviderCouponsRepository(provider._id);
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
      data: updatedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const generateProviderQrCodeService = async (req, res, next) => {
  try {
    const provider = await getProvider(req.body.provider);
    if (!provider) throw new BaseHttpError(625);
    const path = "public/provider-qr-codes/";
    // this is done so that we can have an online url in the manage manageProviderStatusRepository
    // and be able to create the directory if it doesn't exist on the server
    if (!fs.existsSync(`./${path}`)) {
      fs.mkdirSync(path);
    }
    await QRCode.toFile(
      //here the same issue
      `./${path}${provider.code}.png`,
      decodeURI(encodeURI(provider.code)),
      {
        type: "png",
        color: {
          dark: "#575757", // Blue dots
          light: "#0000", // Transparent background
        },
      }
    );
    const updatedProvider = await updateProviderRepository(provider._id, {
      qrURL: `${path}${provider.code}.png`,
    });
    res.status(200).json({
      success: true,
      data: updatedProvider,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateProviderService = async (req, res, next) => {
  try {
    const provider = await updateProviderRepository(req.body.provider, {
      ...req.body,
      image: req.file,
    });
    return res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteProviderService = async (req, res, next) => {
  try {
    const soldCoupons = await getProviderSoldCoupons(req.body.provider);
    if (soldCoupons.length !== 0) throw new BaseHttpError(628);
    await deleteProviderCouponsRepository(req.body.provider);
    const provider = await adminDeleteProviderRepository(req.body.provider);
    return res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCouponService = async (req, res, next) => {
  try {
    const soldCoupon = await checkIfCouponWasSold({ coupon: req.body.coupon });
    if (soldCoupon) throw new BaseHttpError(629);
    const coupon = await deleteCoupon(req.body.coupon);
    return res.status(200).json({
      success: true,
      data: { coupon: { ...coupon } },
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCategoryService = async (req, res, next) => {
  try {
    const category = await findCouponByCategory({
      category: req.body.category,
    });
    if (category) throw new BaseHttpError(630);
    const deletedCategory = await deleteCategory(req.body.category);
    return res.status(200).json({
      success: true,
      data: { category: { ...deletedCategory } },
    });
  } catch (error) {
    next(error);
  }
};

export const getStatisticsService = async (req, res, next) => {
  try {
    const providers = await countProvidersRepository(req.body.filtrationDate);
    const coupons = await countCouponsRepository(req.body.filtrationDate);
    const subscriptions = await countSubscriptionsRepository(
      req.body.filtrationDate
    );
    return res.status(200).json({
      success: true,
      data: { providers, coupons, subscriptions },
    });
  } catch (error) {
    next(error);
  }
};

export const generateProvidersPdf = async (req, res, next) => {
  try {
    const providers = await getAllProvidersWithQrUrlRepository();
    if (!providers) throw new BaseHttpError(645);
    const path = "./public/providers-pdf/";
    const pdfDoc = new PDFDocument();
    const name = "AllProviders.pdf";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    pdfDoc.pipe(fs.createWriteStream(path + name));
    pdfDoc.moveDown(25);
    pdfDoc.fillColor("red").text("Couponat El Madina", { align: "center" });
    providers.map((provider) => {
      pdfDoc.addPage();
      const segment_array = provider.qrURL.split("/");
      const last_segment = segment_array.pop();
      const arabic = /[\u0600-\u06FF]/;
      const name = arabic.test(provider.name)
        ? provider.name.split(" ").reverse().join(" ")
        : provider.name;
      pdfDoc
        .fillColor("blue")
        .font("./assets/fonts/Tajawal-Bold.ttf")
        .fontSize(20)
        .text("Provider: ", {
          continued: true,
        })
        .fillColor("black")
        .fontSize(20)
        .text(name, { rtl: true });
      pdfDoc.moveDown(0.5);
      pdfDoc.image("./public/provider-qr-codes/" + last_segment, {
        align: "center",
        width: 300,
        height: 300,
      });
    });
    pdfDoc.end();
    return res.status(200).send({
      success: true,
      data: process.env.SERVER_IP + path + name,
    });
  } catch (error) {
    next(error);
  }
};
