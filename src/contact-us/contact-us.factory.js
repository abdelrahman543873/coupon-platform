import faker from "faker";
import { UserRoleEnum } from "../user/user-role.enum";
import { ContactUsModel } from "./models/contact-us.model";

export const buildContactUsParams = (obj = {}) => {
  return {
    email: obj.email || faker.internet.email(),
    description: obj.description || faker.commerce.productDescription(),
    reply: obj.reply || faker.date.recent(),
    type: obj.type || faker.random.arrayElement(UserRoleEnum),
  };
};

export const contactUsMessagesFactory = async (count = 10, obj = {}) => {
  const contactUsMessages = [];
  for (let i = 0; i < count; i++) {
    contactUsMessages.push(buildContactUsParams(obj));
  }
  return await ContactUsModel.collection.insertMany(contactUsMessages);
};

export const contactUsFactory = async (obj = {}) => {
  const params = buildContactUsParams(obj);
  return await ContactUsModel.create(params);
};
