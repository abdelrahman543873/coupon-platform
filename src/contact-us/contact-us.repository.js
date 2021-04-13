import { ContactUsModel } from "./models/contact-us.model.js";

export const sendContactUsMessageRepository = async (message) => {
  return await ContactUsModel.create(message);
};

export const deleteContactUsMessageRepository = async ({ _id }) => {
  return await ContactUsModel.findOneAndDelete({ _id }, { lean: true });
};

export const findContactUsMessage = async ({ _id }) => {
  return await ContactUsModel.findOne({ _id }, {}, { lean: true });
};

export const updateContactUsMessage = async ({ _id, contactUsMessage }) => {
  return await ContactUsModel.findOneAndUpdate({ _id }, contactUsMessage, {
    lean: true,
    new: true,
  });
};

export const getContactUsMessagesRepository = async (
  offset = 0,
  limit = 15
) => {
  return await ContactUsModel.paginate(
    {},
    { offset: offset * limit, limit, sort: "-createdAt" }
  );
};

export const rawDeleteContactUs = async () => {
  return await ContactUsModel.deleteMany({});
};
