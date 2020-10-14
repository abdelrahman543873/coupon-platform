import express from "express";
import { uploadHelper } from "../../utils/MulterHelper";
import { CategoryController } from "../controllers";
import { CategoryalidationWares } from "../middlewares/validation";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(
    uploadHelper("Categories-Images/").fields([
      { name: "selectedImage" },
      { name: "unselectedImage" },
    ]),
    CategoryalidationWares.add,
    CategoryController.addCategory
  )
  .get(CategoryController.getAll);

categoryRouter.use("/categories-images", express.static("Categories-Images"));
export { categoryRouter };
