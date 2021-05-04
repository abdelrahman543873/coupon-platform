import Joi from "joi";

export const GetSubscriptionInput = Joi.object({
  subscription: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
