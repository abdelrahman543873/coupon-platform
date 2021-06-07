import { getCoupon, updateCouponById } from "../coupon/coupon.repository.js";
import { PaymentEnum } from "../payment/payment.enum.js";
import { findPayment } from "../payment/payment.repository.js";
import { findProviderById } from "../provider/provider.repository.js";
import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  getAdminSubscriptionsRepository,
  getCustomerCouponNotUsedSubscriptionRepository,
  getProviderHomeRepository,
  getSubscriptionRepository,
  getUnconfirmedPaymentsRepository,
  markCouponUsedRepository,
  confirmCouponPayment,
  getCustomerSubscriptionsRepository,
  getSubscriptionsRepository,
  createSubscriptionRepository,
} from "./subscription.repository.js";
import { notifyUsers } from "../notification/notification.service.js";
import {
  NewCustomerMessage,
  NewSubscriptionMessage,
} from "../notification/notification.enum.js";
import { UserRoleEnum } from "../user/user-role.enum.js";

export const getAllSubscriptionsService = async (req, res, next) => {
  try {
    const subscriptions = await getAdminSubscriptionsRepository(
      req.query.paymentType,
      req.query.provider,
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionService = async (req, res, next) => {
  try {
    const subscription = await getSubscriptionRepository({
      _id: req.query.subscription,
      ...(req.currentUser.role === UserRoleEnum[0] && {
        provider: req.currentUser._id,
      }),
    });
    if (!subscription) throw new BaseHttpError(619);
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderHomeService = async (req, res, next) => {
  try {
    const home = await getProviderHomeRepository(req.currentUser._id);
    return res.status(200).json({
      success: true,
      data: home,
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
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const subscribeService = async (req, res, next) => {
  try {
    const provider = await findProviderById(req.body.provider);
    if (!provider) throw new BaseHttpError(625);
    const coupon = await getCoupon({ _id: req.body.coupon });
    if (!coupon) throw new BaseHttpError(618);
    if (coupon.amount === 0) throw new BaseHttpError(636);
    const existingSubscriptionSameCoupon =
      await getCustomerCouponNotUsedSubscriptionRepository({
        customer: req.currentUser._id,
        coupon: coupon._id,
        provider: provider._id,
      });
    if (existingSubscriptionSameCoupon) throw new BaseHttpError(641);
    const paymentType = await findPayment({ _id: req.body.paymentType });
    if (!paymentType) throw new BaseHttpError(633);
    if (
      paymentType.key !== PaymentEnum[2] &&
      (!req.body.account || !req.body.transactionId)
    )
      throw new BaseHttpError(634);
    if (paymentType.key == PaymentEnum[1] && !req.file)
      throw new BaseHttpError(635);
    const subscription = await createSubscriptionRepository({
      subscription: {
        coupon: coupon._id,
        provider: provider._id,
        paymentType: paymentType._id,
        customer: req.currentUser._id,
        image: req.file,
        account: req.body.account,
        transactionId: req.body.transactionId,
        total: req.body.total,
        isConfirmed:
          paymentType.key === PaymentEnum[2] ||
          paymentType.key === PaymentEnum[0],
      },
    });
    await updateCouponById(coupon._id, {
      input: { amount: coupon.amount - 1 },
    });
    await notifyUsers(
      NewSubscriptionMessage(req.currentUser, coupon, subscription),
      provider._id
    );
    res.status(200).json({
      success: true,
      data: { ...(await getSubscriptionRepository({ _id: subscription._id })) },
    });
  } catch (error) {
    next(error);
  }
};

export const markCouponUsedService = async (req, res, next) => {
  try {
    const subscription = await getCustomerCouponNotUsedSubscriptionRepository({
      customer: req.currentUser._id,
      _id: req.body.subscription,
    });
    if (!subscription) throw new BaseHttpError(642);
    const coupon = await markCouponUsedRepository({
      _id: req.body.subscription,
    });
    res.status(200).json({
      success: true,
      data: coupon,
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
      ...(req.body.arMessage && {
        isConfirmed: false,
        enRejectionReason: req.body.enMessage,
        arRejectionReason: req.body.arMessage,
      }),
      ...(!req.body.arMessage && { isConfirmed: true }),
    });
    if (req.body.arMessage)
      await notifyUsers(
        NewCustomerMessage(
          req.body.arMessage,
          req.body.enMessage,
          subscription._id
        ),
        subscription.customer
      );
    res.status(200).json({
      success: true,
      data: { subscription: updatedSubscription },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerSubscriptionsService = async (req, res, next) => {
  try {
    const subscriptions = await getCustomerSubscriptionsRepository(
      req.currentUser._id,
      req.query.offset,
      req.query.limit,
      req.body.code,
      false
    );
    if (subscriptions.docs.length === 0) throw new BaseHttpError(640);
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerHomeSubscriptionsService = async (req, res, next) => {
  try {
    const subscriptions = await getCustomerSubscriptionsRepository(
      req.currentUser._id,
      req.query.offset,
      req.query.limit,
      req.body.code
    );
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionsService = async (req, res, next) => {
  try {
    const subscribers = await getSubscriptionsRepository(
      req.currentUser._id,
      req.query.offset,
      req.query.coupon,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};
