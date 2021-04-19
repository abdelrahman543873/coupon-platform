import {
  getSubscriptionRepository,
  confirmCouponPayment,
  getUnconfirmedPaymentsRepository,
} from "../coupon/coupon.repository.js";
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
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: payments,
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

export const confirmPaymentService = async (req, res, next) => {
  try {
    const subscription = await getSubscriptionRepository({
      _id: req.body.subscription,
    });
    if (!subscription) throw new BaseHttpError(619);
    const updatedSubscription = await confirmCouponPayment({
      _id: subscription._id,
    });
    res.status(200).json({
      success: true,
      data: { subscription: updatedSubscription },
    });
  } catch (error) {
    next(error);
  }
};

export const getUnconfirmedPaymentsService = async (req, res, next) => {
  try {
    const subscriptions = await getUnconfirmedPaymentsRepository(
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: { subscriptions },
    });
  } catch (error) {
    next(error);
  }
};
