import { sendContactUsMessageRepository } from "./contact-us.repository.js";

export const sendContactUsMessageService = async (req, res, next) => {
  try {
    const message = await sendContactUsMessageRepository({
      ...req.body,
      type: req.currentUser.role,
    });
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch {
    next(error);
  }
};
