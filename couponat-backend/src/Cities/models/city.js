import mongoose from "mongoose";

let citySchema = mongoose.Schema(
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
  },
  { versionKey: false }
);

let CityModel = mongoose.model("City", citySchema);

export { CityModel };
