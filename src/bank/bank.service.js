import { addBankAccountRepository } from "./bank.repository.js";
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
