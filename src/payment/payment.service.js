import { addPaymentTypeRepository } from "./payment.repository.js";
export const addPaymentTypeService = async (req, res, next) => {
  try {
    const payment = await addPaymentTypeRepository({ payment: req.body });
    res.status(200).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};
