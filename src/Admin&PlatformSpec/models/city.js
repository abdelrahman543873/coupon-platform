import mongoose from "mongoose";

let citySchema = mongoose.Schema(
  {
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
    districts: {
      type: [
        {
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
          }
        }
      ],
      index: 1
    }
  },
  { versionKey: false }
);

let CityModel = mongoose.model('City', citySchema)

export { CityModel }
