import boom from "@hapi/boom";
import { addAddressSchema, editAddressSchema } from "../../utils/validations/addresses";

const AddressesValidationwar = {
  add(req, res, next) {
    const { error } = addAddressSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  },

  editAddress(req,res,next){
    console.log("here");
    const { error } = editAddressSchema.validate(req.body);

    if (error) {
      return next(boom.badData(error.details[0].message));
    }

    next();
  }
};

export { AddressesValidationwar }
