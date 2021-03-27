import express from "express";
import { CategoryController } from "../controllers";

const categoryRouter = express.Router();

categoryRouter.route("/").get(CategoryController.getAll);

categoryRouter.use("/categories-images", express.static("Categories-Images"));
categoryRouter.use(
  "/categories-images/selected.png",
  express.static("assets/images/selected.png")
);
categoryRouter.use(
  "/categories-images/unselected.png",
  express.static("assets/images/unselected.png")
);
export { categoryRouter };
