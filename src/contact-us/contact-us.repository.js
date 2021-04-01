import { ContactUsModel } from "./models/contact-us.model.js";

export const sendContactUsMessageRepository = async (message) => {
  return await ContactUsModel.create(message);
};

export const rawDeleteContactUs = async () => {
  return await ContactUsModel.deleteMany({});
};
