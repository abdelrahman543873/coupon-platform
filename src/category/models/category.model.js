import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const category = mongoose.Schema(
  {
    arName: {
      type: String,
      required: true,
      trim: true,
    },
    enName: {
      type: String,
      required: true,
      trim: true,
    },
    selected: { type: String, trim: true },
    unSelected: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
category.plugin(mongoosePaginate);
export const CategoryModel = mongoose.model("Category", category);
