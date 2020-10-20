import express from "express";
import { CategoryController } from "../controllers";

const categoryRouter = express.Router();

categoryRouter.route("/").get(CategoryController.getAll);

categoryRouter.use("/categories-images", express.static("Categories-Images"));
export { categoryRouter };
