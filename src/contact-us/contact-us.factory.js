import faker from "faker";
import { UserRoleEnum } from "../user/user-role.enum";
import { ContactUsModel } from "./models/contact-us.model";
import { providerFactory } from "../provider/provider.factory.js";

export const buildContactUsParams =async (obj = {}) => {
  return {
    email: obj.email || (await providerFactory()).email,
    description: obj.description || faker.commerce.productDescription(),
    reply: {
      message: obj.reply || faker.random.words(),
      date: obj.date || faker.date.recent(),
    },
    type: obj.type || faker.random.arrayElement(UserRoleEnum),
  };
};

export const contactUsMessagesFactory = async (count = 10, obj = {}) => {
  const contactUsMessages = [];
  for (let i = 0; i < count; i++) {
    contactUsMessages.push(await buildContactUsParams(obj));
  }
  return await ContactUsModel.collection.insertMany(contactUsMessages);
};

export const contactUsFactory = async (obj = {}) => {
  const params = await buildContactUsParams(obj);
  return await ContactUsModel.create(params);
};
