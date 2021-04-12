import {
  deleteContactUsMessageRepository,
  getContactUsMessagesRepository,
  sendContactUsMessageRepository,
} from "./contact-us.repository.js";

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

export const deleteContactUsMessageService = async (req, res, next) => {
  try {
    const deletedMessage = await deleteContactUsMessageRepository({
      _id: req.body.contactUsMessage,
    });
    res.status(200).json({
      success: true,
      data: { message: deletedMessage },
    });
  } catch {
    next(error);
  }
};

export const getContactUsMessagesService = async (req, res, next) => {
  try {
    const messages = await getContactUsMessagesRepository(
      req.query.offset,
      req.query.limit
    );
    res.status(200).json({
      success: true,
      data: { messages },
    });
  } catch {
    next(error);
  }
};
