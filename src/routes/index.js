import { Router } from "express";
import { customersRouter } from "../CustomersManagement/routes/index";
import { providerManagementRouter } from "../ProviderManagement/routes";
import { productsRouter } from "../Products/routes";
import { purchasingRouter } from "../Purchasing/routes";
import {
  notificationFileName,
  notificationRouter,
} from "../CloudMessaging/routes/index";
import { orderFileName } from "../Purchasing/routes/order/index";
import {
  adminRouter,
  adminFileName,
} from "../Admin&PlatformSpec/routes/adminRouter";
import {
  platformSpecRouter,
  citiesFileName,
} from "../Admin&PlatformSpec/routes/platformRouter";
import { bazarFilename } from "../ProviderManagement/routes/bazar";
import { providerFilename } from "../ProviderManagement/routes/provider";
import { couponFileName } from "../Products/routes/coupon";
import { productFileName } from "../Products/routes/product/index";
import { customerFileName } from "../CustomersManagement/routes";
import { adminBazarFileName } from "../Admin&PlatformSpec/routes/Admin/bazars";
import { userAddressesFilename } from "../Purchasing/routes/addresses";
import { chatFileName, chatRouter } from "../chat/routes";
import { adminCityFileName } from "../Admin&PlatformSpec/routes/Admin/cities";
import { offersFileName } from "../Products/routes/offers";
import { qrRouter } from "../QRGeneration/route";

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0", // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: "Bazar", // Title (required)
      version: "1.0.0", // Version (required)
      description: "All Users Endpoints.",
    },
  },
  apis: [
    notificationFileName,
    citiesFileName,
    providerFilename,
    bazarFilename,
    couponFileName,
    customerFileName,
    adminBazarFileName,
    adminFileName,
    productFileName,
    userAddressesFilename,
    chatFileName,
    orderFileName,
    adminCityFileName,
    offersFileName,
  ],
};
const swaggerSpec = swaggerJSDoc(options);

const router = Router();
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use("/customers-management", customersRouter);

router.use("/chat", chatRouter);

router.use("/admins", adminRouter);
router.use("/QRCode", qrRouter);

router.use("/platform", platformSpecRouter);

router.use("/providers-management", providerManagementRouter);

router.use("/products", productsRouter);

router.use("/purchasing-management", purchasingRouter);
router.use("/notifications", notificationRouter);

export { router };
