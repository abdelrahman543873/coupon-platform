import express from "express";
import { QRController } from "../controller";

const qrRouter = express.Router();
qrRouter.route("/new").get(QRController.generateCode);
qrRouter.use("/qr-images", express.static("QR-Images"));
export { qrRouter };
