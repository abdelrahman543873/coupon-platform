import {
  addPaymentTypeRepository,
  getPaymentTypesRepository,
} from "./payment.repository.js";
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

export const getPaymentTypesService = async (req, res, next) => {
  try {
    const payments = await getPaymentTypesRepository(
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: { payments },
    });
  } catch (error) {
    next(error);
  }
};
