const { Payment } = require("../../middlewares/responsHandler");
const { paymentTypeModule } = require("../modules/paymentType");

let PaymentTypeController = {
  async add(req, res, next) {
    let payment = req.body;

    if (req.file) {
      console.log("imgURL: ", req.file);
      let imgURL =
        "/purchasing-management/payments-images/" + req.file.filename;
      payment.imgURL = imgURL;
    }
    let addPay = await paymentTypeModule.add(payment);

    if (addPay.err) {
      return res.send({
        isSuccessed: false,
        data: null,
        error: addPay.err,
      });
    }
    addPay = new Payment(addPay.doc);
    return res.status(201).send({
      isSuccessed: true,
      data: addPay,
      error: null,
    });
  },

  async getAll(req, res, next) {
    let getPay = await paymentTypeModule.getAll();
    getPay = getPay.map((pay) => {
      return new Payment(pay);
    });
    return res.status(201).send({
      isSuccessed: true,
      data: getPay,
      error: null,
    });
  },

  async switchPaymentWay(req, res, next) {
    let id = req.params.id;
    let switchPay = await paymentTypeModule.switchPayment(id);
    return res.status(201).send({
      isSuccessed: true,
      data: true,
      error: null,
    });
  },
};

export { PaymentTypeController };
