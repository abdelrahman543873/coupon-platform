import { PaymentModel } from "../models/payment";
import { OrderModel } from "../models/order";

let PaymentModule = {
  async addPayment(payment) {
    return await PaymentModel({ ...payment })
      .save()
      .then((doc) => {
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

  async getById(id) {
    return await PaymentModel.findById(id);
  },

  async getPayments(bazar) {
    let orders = await OrderModel.find({ bazar: bazar }, { _id: 1 });
    let ordersIds = [];

    for (let i = 0; i < orders.length; i++) {
      ordersIds.push(orders[i]._id);
    }

    console.log(ordersIds);

    if (!orders || orders == []) return [];

    let payments = await PaymentModel.find({
      order: { $in: ordersIds },
      isConfirmed: false,
      isRefused:false
    }).populate("order");
    for (let i = 0; i < payments.length; i++) {
      payments[i] = await payments[i].populate("order.clientId").execPopulate();
    }

    return payments;
  },

  async paymentConfirmation(id) {
    console.log(id);
    return await PaymentModel.findByIdAndUpdate(
      id,
      { $set: { isConfirmed: true } },
      { new: true }
    );
  },
  async paymentRejection(id) {
    console.log(id);
    return await PaymentModel.findByIdAndUpdate(
      id,
      { $set: { isRefused: true } },
      { new: true }
    );
  },
};

export { PaymentModule };
