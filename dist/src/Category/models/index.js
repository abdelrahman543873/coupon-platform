import mongoose from "mongoose";
let categorySchema = mongoose.Schema({
  name: {
    arabic: {
      type: String,
      required: true,
      trim: true
    },
    english: {
      type: String,
      required: true,
      trim: true
    }
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  },
  images: {
    selected: String,
    unSelected: String
  }
}, {
  timestamps: true,
  versionKey: false
});
let CategoryModel = mongoose.model("Category", categorySchema);
export { CategoryModel };