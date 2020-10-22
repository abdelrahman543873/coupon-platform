import mongoose from "mongoose";

let districtSchema = mongoose.Schema(
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
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false }
);

let DistrictModel = mongoose.model("Districts", districtSchema);

export { DistrictModel };
