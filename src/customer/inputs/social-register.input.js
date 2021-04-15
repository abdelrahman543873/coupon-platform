import Joi from "joi";
import { socialMediaEnum } from "../social-media-type.enum.js";
export const SocialRegisterInput = Joi.object({
  name: Joi.string().min(3).max(30),
  socialMediaId: Joi.string(),
  socialMediaType: Joi.string().valid(...socialMediaEnum),
  phone: Joi.string().regex(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
  email: Joi.string().email().lowercase(),
}).or("email", "phone");
