import mongoose from "mongoose";
import { string } from "@hapi/joi";

let userAddressesSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Client",
    },
    addresses: {
      type: [
        {
          lat: {
            type: Number,
            required: true,
          },
          lng: {
            type: Number,
            required: true,
          },
          street: {
            type: String,
            required: true,
          },
          district: {
            type: String,
            required: true,
          },
          city: {
            type: String,
            required: true,
          },
          countryName: {
            type: String,
            required: true,
            default: "Saudi Arabia",
          },
          countryCode: {
            type: String,
            required: true,
            default: "KSA",
          },
          buildingNo: String,
          floorNo: String,
          addressName: {
            type: String,
            required: true,
          },
          isMainAddress: {
            type: Boolean,
            default: false,
          },
        },
      ],
      index: 1,
    },
  },
  { versionKey: false }
);

userAddressesSchema.statics.setMainAddress = async function (
  userId,
  addressId
) {
  const filter = {
    userId,
    "addresses._id": addressId,
  };

  let userAddresses = await this.findOne(filter),
    mainAddressIndex = userAddresses.addresses
      .map((address) => {
        return address._id;
      })
      .indexOf(addressId);

  userAddresses.addresses[mainAddressIndex].isMainAddress = true;
  return await userAddresses.save();
};

userAddressesSchema.pre("setMainAddress", async function (next, userId) {
  const filter = {
    userId,
    "addresses.isMainAddress": true,
  };

  let userAddresses = await this.findOne(filter);
  if (!userAddresses) next();

  let mainAddressIndex = userAddresses.addresses
    .map((address) => {
      return address.isMainAddress;
    })
    .indexOf(true);

  userAddresses.addresses[mainAddressIndex].isMainAddress = false;
  await userAddresses.save();
  next();
});

let UserAddresses = mongoose.model("ClientAddresses", userAddressesSchema);

export { UserAddresses };
