import mongoose from "mongoose";
import { UserAddresses } from "../models/address";

const AddressesModule = {
  async add(userId, address, isMainAddress) {
    let main = "";
    address._id = mongoose.Types.ObjectId();
    let updateQuery = {
        $push: { addresses: address },
      },
      userAddresses = await UserAddresses.findOneAndUpdate(
        { userId },
        updateQuery,
        {
          new: true,
          upsert: true,
        }
      ).catch((err) => {
        console.log(err);
        return null;
      });
    if (!userAddresses) return null;
    if (isMainAddress) {
      await this.makeItMain(userId, address._id);
      return await this.getUserAddresses(userId);
    }
    return userAddresses.addresses;
  },
  async makeItMain(userId, addressId) {
    return await UserAddresses.setMainAddress(userId, addressId)
      .then((doc) => doc.addresses[0])
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async getUserAddresses(userId) {
    return await UserAddresses.findOne({ userId })
      .select("addresses -_id")
      .then((doc) => doc.addresses)
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async getAddressById(id, userId) {
    let userAddresses = await UserAddresses.findOne({ userId })
      .select("addresses -_id")
      .then((doc) => doc.addresses)
      .catch((err) => {
        console.log(err);
        return [];
      });
    let addres;
    for (let i = 0; i < userAddresses.length; i++) {
      if (userAddresses[i]._id + "" == id + "") addres = userAddresses[i];
    }
    console.log("-------",id,"----")
    console.log(addres);
    return addres;
  },

  async editAddress(userId, addressId, newAddress) {
    let userAddresses = await UserAddresses.findOne({ userId });
    userAddresses.addresses = userAddresses.addresses.map((address) => {
      if (address._id + "" == addressId) {
        let id = address._id;
        address._id = id;
        if (newAddress.city) address.city = newAddress.city;
        if (newAddress.district) address.district = newAddress.district;
        if (newAddress.street) address.street = newAddress.street;
        if (newAddress.addressName)
          address.addressName = newAddress.addressName;
        if (newAddress.buildingNo) address.buildingNo = newAddress.buildingNo;
        if (newAddress.floorNo) address.floorNo = newAddress.floorNo;
        if (newAddress.lat) address.lat = newAddress.lat;
        if (newAddress.lng) address.lng = newAddress.lng;
      }
      return address;
    });
    userAddresses = await userAddresses.save();
    return userAddresses;
  },

  async deleteAddress(userId, addressId) {
    let userAddresses = await UserAddresses.findOne({ userId });

    userAddresses.addresses = userAddresses.addresses.filter((address) => {
      return address._id + "" !== addressId;
    });

    userAddresses = await userAddresses.save();
    return userAddresses;
  },
};

export { AddressesModule };
