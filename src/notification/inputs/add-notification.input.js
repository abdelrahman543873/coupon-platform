import Joi from "joi";
export const AddNotificationInput = Joi.object({
  fcmToken: Joi.string().required(),
});
