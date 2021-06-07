import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  addPaymentTypeRepository,
  findPayment,
  getPaymentTypesRepository,
  updatePaymentTypeRepository,
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
      req.query.limit,
      req.query.isActive == "true"
    );
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentTypeService = async (req, res, next) => {
  try {
    const payment = await findPayment({ _id: req.body.payment });
    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentTypeService = async (req, res, next) => {
  try {
    const payment = await findPayment({ _id: req.body.paymentTypeId });
    if (!payment) throw new BaseHttpError(633);
    const paymentType = await updatePaymentTypeRepository({
      _id: payment._id,
      paymentType: { isActive: !payment.isActive },
    });
    res.status(200).json({
      success: true,
      data: { paymentType },
    });
  } catch (error) {
    next(error);
  }
};
