import boom from "@hapi/boom";
import { ClientModule } from "../../CustomersManagement/modules/client";
import { AddressesModule } from "../modules/addresses";

const AddressesController = {
  async add(req, res, next) {
    let {
        authId,
        city,
        district,
        street,
        lat,
        lng,
        buildingNo = "",
        floorNo = "",
        addressName,
        countryCode = "KSA",
        countryName = "Saudi Arabia",
        isMainAddress = false,
      } = req.body,
      lang = req.headers.lang || "ar";

    let user = await ClientModule.getById(authId);
    if (!user) {
      let errMsg = lang == "en" ? "User not found" : "المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let userAddresses = await AddressesModule.add(
      authId,
      {
        city,
        district,
        street,
        lat,
        lng,
        buildingNo,
        floorNo,
        addressName,
        countryCode,
        countryName,
      },
      isMainAddress
    );
    if (!userAddresses)
      return next(boom.internal("Error upserting address to user addresses"));
    console.log(userAddresses);
    return res.status(201).send({
      isSuccessed: true,
      data: userAddresses,
      error: null,
    });
  },
  async getUserAddresses(req, res, next) {
    let userId = req.body.authId;
    return res.status(200).send({
      isSuccessed: true,
      data: await AddressesModule.getUserAddresses(userId),
      error: null,
    });
  },

  async setMainAdress(req, res, next) {
    let userId = req.body.authId;
    let addressId = req.params.id;

    return res.status(200).send({
      isSuccessed: true,
      data: await AddressesModule.makeItMain(userId, addressId),
      error: null,
    });
  },

  async editAddress(req, res, next) {
    let {
      authId,
      city,
      district,
      street,
      lat,
      lng,
      buildingNo = "",
      floorNo = "",
      addressName,
      countryCode = "KSA",
      countryName = "Saudi Arabia",
    } = req.body;
    let addressId = req.params.id;

    let user = await ClientModule.getById(authId);
    if (!user) {
      let errMsg = lang == "en" ? "User not found" : "المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }

    let newAddress = {
      city,
      district,
      street,
      lat,
      lng,
      buildingNo,
      floorNo,
      addressName,
      countryCode,
      countryName,
    };

    let editAddress = await AddressesModule.editAddress(
      authId,
      addressId,
      newAddress
    );

    if (!editAddress)
      return next(boom.internal("Error upserting address to user addresses"));

    return res.status(201).send({
      isSuccessed: true,
      data: editAddress.addresses,
      error: null,
    });
  },

  async deleteAddress(req, res, next) {
    let { authId } = req.body;
    let addressId = req.params.id;

    let user = await ClientModule.getById(authId);
    if (!user) {
      let errMsg = lang == "en" ? "User not found" : "المستخدم غير موجود";
      return next(boom.notFound(errMsg));
    }
    let deletAddress = await AddressesModule.deleteAddress(authId, addressId);

    if (!deletAddress)
      return next(boom.internal("Error upserting address to user addresses"));

    return res.status(201).send({
      isSuccessed: true,
      data: deletAddress.addresses,
      error: null,
    });
  },
};

export { AddressesController };
