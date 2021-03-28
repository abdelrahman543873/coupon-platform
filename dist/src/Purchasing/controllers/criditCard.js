import { Cridit } from "../../middlewares/responsHandler.js";
import { AppCreditModel } from "../models/appCridit.js";
let CriditCardController = {
  async get(req, res, next) {
    let cridit = await AppCreditModel.findOne();
    cridit = new Cridit(cridit);
    return res.status(200).send({
      isSuccessed: true,
      data: cridit,
      error: null
    });
  }

};
export { CriditCardController };