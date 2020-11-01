import { PeymentTypeModel } from "../models/paymentType";

let paymentTypeModule = {
  async add(payment) {
    return await PeymentTypeModel({ ...payment })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          doc: null,
          err,
        };
      });
  },
  async switchPayment(id) {
    let payment = await PeymentTypeModel.findById(id);
    payment.isActive = !payment.isActive;
    payment = await payment.save();
    return payment;
  },
  async getAll(isAdmin = null) {
    let queryOp = {};
    queryOp.isActive = true;
    isAdmin == "true" ||isAdmin ==  true ? delete queryOp.isActive : "";
    return await PeymentTypeModel.find({ ...queryOp });
  },
};

export { paymentTypeModule };
