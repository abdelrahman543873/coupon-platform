import { Payment } from "../../middlewares/responsHandler.js";
import { paymentTypeModule } from "../modules/paymentType.js";
let PaymentTypeController = {
  async add(req, res, next) {
    let payment = req.body;
    let addPay = await paymentTypeModule.add(payment);

    if (addPay.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: addPay.err
      });
    }

    addPay = new Payment(addPay.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: addPay,
      error: null
    });
  },

  async getAll(req, res, next) {
    let getPay = await paymentTypeModule.getAll();
    getPay = getPay.map(pay => {
      return new Payment(pay);
    });
    return res.status(201).send({
      isSuccessed: true,
      data: getPay,
      error: null
    });
  },

  async getAllForAdmin(req, res, next) {
    let getPay = await paymentTypeModule.getAll(true);
    console.log(getPay);
    getPay = getPay.map(pay => {
      return new Payment(pay);
    });
    return res.status(201).send({
      isSuccessed: true,
      data: getPay,
      error: null
    });
  },

  async switchPaymentWay(req, res, next) {
    let id = req.params.id;
    let switchPay = await paymentTypeModule.switchPayment(id);
    return res.status(201).send({
      isSuccessed: true,
      data: true,
      error: null
    });
  }

};
export { PaymentTypeController };