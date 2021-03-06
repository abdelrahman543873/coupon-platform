import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  updateCreditRepository,
  addCreditRepository,
  getCreditRepository,
} from "./credit.repository.js";

export const updateCreditService = async (req, res, next) => {
  try {
    const credit = await getCreditRepository();
    if (!credit) throw new BaseHttpError(646);
    const updatedCredit = await updateCreditRepository({
      bank: {
        _id: credit._id,
        secretKey: req.body.secretKey,
        merchantEmail: req.body.merchantEmail,
      },
    });
    if (!credit) throw new BaseHttpError(643);
    res.status(200).json({
      success: true,
      data: updatedCredit,
    });
  } catch (error) {
    next(error);
  }
};

export const addCreditService = async (req, res, next) => {
  try {
    const credit = await addCreditRepository({
      bank: {
        secretKey: req.body.secretKey,
        merchantEmail: req.body.merchantEmail,
      },
    });
    res.status(200).json({
      success: true,
      data: credit,
    });
  } catch (error) {
    next(error);
  }
};

export const getCreditService = async (req, res, next) => {
  try {
    const credit = await getCreditRepository();
    res.status(200).json({
      success: true,
      data: credit,
    });
  } catch (error) {
    next(error);
  }
};
