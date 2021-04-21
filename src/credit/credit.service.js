import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import {
  updateCreditRepository,
  addCreditRepository,
} from "./credit.repository.js";

export const updateCreditService = async (req, res, next) => {
  try {
    const credit = await updateCreditRepository({
      bank: {
        _id: req.body.credit,
        secretKey: req.body.secretKey,
        merchantEmail: req.body.merchantEmail,
      },
    });
    if (!credit) throw new BaseHttpError(643);
    res.status(200).json({
      success: true,
      data: credit,
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
