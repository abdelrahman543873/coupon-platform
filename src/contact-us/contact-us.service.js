import { BaseHttpError } from "../_common/error-handling-module/error-handler.js";
import { sendClientMail } from "../_common/helpers/nodemailer.js";
import {
  deleteContactUsMessageRepository,
  getContactUsMessagesRepository,
  sendContactUsMessageRepository,
  findContactUsMessage,
  updateContactUsMessage,
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

export const getContactUsMessageService = async (req, res, next) => {
  try {
    const Message = await findContactUsMessage({
      _id: req.query.contactUsMessage,
    });
    res.status(200).json({
      success: true,
      data: { message: Message },
    });
  } catch {
    next(error);
  }
};

export const getContactUsMessagesService = async (req, res, next) => {
  try {
    const messages = await getContactUsMessagesRepository(
      req.query.offset,
      req.query.limit,
      req.query.email
    );
    res.status(200).json({
      success: true,
      data: { messages },
    });
  } catch {
    next(error);
  }
};

export const adminSendContactsUsMessage = async (req, res, next) => {
  try {
    const message = await findContactUsMessage({ _id: req.body.messageId });
    if (!message) throw new BaseHttpError(632);
    // change this hard coded string
    await sendClientMail("Couponat El-Madena", req.body.reply, message.email);
    const updatedMessage = await updateContactUsMessage({
      _id: message._id,
      contactUsMessage: {
        reply: {
          message: req.body.reply,
          date: new Date(),
          email: req.currentUser.email,
          name: req.currentUser.name,
        },
      },
    });
    res.status(200).json({
      success: true,
      data: updatedMessage,
    });
  } catch {
    next(error);
  }
};
