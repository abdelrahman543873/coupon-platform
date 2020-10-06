import { OrderModel } from "../models/order";
import { BazarModule } from "../../ProviderManagement/modules/bazar";

let OrderModule = {
  async getById(id) {
    return await OrderModel.findById(id);
  },

  async addOrder(
    products,
    clientId,
    bazar,
    total,
    paymentType,
    deliveryAddress
  ) {
    return await OrderModel({
      products,
      clientId,
      bazar,
      total,
      paymentType,
      deliveryAddress,
    })
      .save()
      .then(async (doc) => {
        doc = await doc
          .populate("paymentType")
          .populate("products.product")
          .populate("bazar")
          .execPopulate();
        doc = await doc
          .populate("bazar.bankAccount")
          .populate("bazar.creditCard")
          .execPopulate();
        return {
          data: doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          data: null,
          err: err,
        };
      });
  },

  async getOrders(clientId, state, bazar, clientPop , bazarPop) {
    let queryOp = {};
    let clientPath = "";
    let bazarPath = "";

    if (clientPop == "true"||clientPop==true) clientPath = "clientId";
    if (bazarPop == "true" || bazarPop == true) bazarPath = "bazar";
    if (clientId) queryOp.clientId = clientId;
    if (state) queryOp.state = state;
    if (bazar) queryOp.bazar = bazar;

    return await OrderModel.find({ ...queryOp })
      .populate("products.product")
      .populate("paymentId")
      .populate("paymentType")
      .populate({ path: clientPath })
      .populate({ path: bazarPath })
      .sort("-createdAt")
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async changeState(id, state, note = null) {
    let queryOp = {};
    queryOp.state = state;
    if (note) queryOp.note = note;

    return await OrderModel.findByIdAndUpdate(
      id,
      { $set: { ...queryOp } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return {
        err: err,
      };
    });
  },

  async getBazarPaymentWays(id) {
    let bazar = await BazarModule.getById(id);
    bazar = await bazar.populate("paymentType").execPopulate();
    console.log(bazar);
    return bazar.paymentType;
  },
};
export { OrderModule };
