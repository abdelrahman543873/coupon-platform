import mongoose from "mongoose";

const category = mongoose.Schema(
  {
    name: {
      arabic: {
        type: String,
        required: true,
        trim: true,
      },
      english: {
        type: String,
        required: true,
        trim: true,
      },
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    images: {
      selected: String,
      unSelected: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CategoryModel = mongoose.model("Category", category);
