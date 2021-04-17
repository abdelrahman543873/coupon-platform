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
    location: {
      lat: { type: String, required: true },
      long: { type: String, required: true },
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { versionKey: false }
);

// let CityModel = mongoose.model("City", citySchema);

// export { CityModel };
