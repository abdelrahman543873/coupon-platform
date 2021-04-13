import Joi from "joi";
import { socialMediaEnum } from "../social-media-type.enum.js";
export const SocialRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30),
  socialMediaId: Joi.string(),
  socialMediaType: Joi.string().valid(...socialMediaEnum),
  phone: Joi.string().min(8).optional(),
  email: Joi.string().email().lowercase().optional(),
}).or("email", "phone");
