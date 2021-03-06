import {
  addBankAccountRepository,
  getBankAccountRepository,
  getBankAccountsRepository,
  updateBankAccountRepository,
} from "./bank.repository.js";
export const addBankAccountService = async (req, res, next) => {
  try {
    const bank = await addBankAccountRepository(req.body);
    res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBankAccountService = async (req, res, next) => {
  try {
    const bank = await getBankAccountRepository({ _id: req.body.bank });
    const updatedBank = await updateBankAccountRepository({
      _id: req.body.bank,
      bank: { isActive: !bank.isActive },
    });
    res.status(200).json({
      success: true,
      data: updatedBank,
    });
  } catch (error) {
    next(error);
  }
};

export const getBankAccountsService = async (req, res, next) => {
  try {
    const banks = await getBankAccountsRepository(
      req.query.limit,
      req.query.offset
    );
    res.status(200).json({
      success: true,
      data: banks,
    });
  } catch (error) {
    next(error);
  }
};

export const getBankAccountService = async (req, res, next) => {
  try {
    const bank = await getBankAccountRepository({ _id: req.query.bank });
    res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};
