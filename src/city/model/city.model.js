import mongoose from "mongoose";
import { type } from "../city.enum.js";

// done according to the mongoose specification here https://mongoosejs.com/docs/geojson.html
const polygonSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: type[0],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
  { versionKey: false, _id: false }
);

let city = mongoose.Schema(
  {
    enName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    arName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    area: { type: polygonSchema, index: "2dsphere", required: true },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { versionKey: false }
);

export const CityModel = mongoose.model("City", city);
