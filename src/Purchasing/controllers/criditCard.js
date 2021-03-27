import { Cridit } from "../../middlewares/responsHandler";
import { AppCreditModel } from "../models/appCridit";

let CriditCardController = {
  async get(req, res, next) {
    let cridit = await AppCreditModel.findOne();
    cridit = new Cridit(cridit);
    return res.status(200).send({
      isSuccessed: true,
      data: cridit,
      error: null,
    });
  },
};
export { CriditCardController };
