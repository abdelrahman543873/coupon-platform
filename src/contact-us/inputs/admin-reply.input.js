import Joi from "joi";
export const AdminReplyInput = Joi.object({
  messageId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  reply: Joi.string().min(8).required(),
});
