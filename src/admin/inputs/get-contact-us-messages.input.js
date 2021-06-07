import Joi from "joi";
import { offSetLimit } from "../../_common/helpers/limit-skip-validation";
export const GetContactUsMessagesInput = Joi.object({
  ...offSetLimit,
  email: Joi.string().email(),
});
