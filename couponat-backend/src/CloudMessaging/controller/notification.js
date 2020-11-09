import { ProviderModel } from "../../Users/models/provider";
import { ClientModel } from "../../Users/models/client";
import { AdminModel } from "../../Admin/models/admin";
import { NotificationModule } from "../module/notification";
import { decodeToken } from "../../utils/JWTHelper";
import { TokensModel } from "../model/tokens";

let notificationsController = {
  async addTokenToUser(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      userId = auth ? auth.id : "",
      type = auth ? auth.type : "";
    let registrationToken = req.body.fcmToken,
      user;
    if (!auth) {
      let addToken = await TokensModel({ fcmToken: registrationToken }).save();
      return await res.status(201).send({
        isSuccessed: true,
        data: addToken,
        error: null,
      });
    } else {
      if (type == "ADMIN") user = await AdminModel.findById(userId);
      else if (type == "CLIENT") user = await ClientModel.findById(userId);
      else if (type == "PROVIDER") user = await ProviderModel.findById(userId);
      console.log("userId : ", userId);
      console.log("type : ", type);
      console.log("users : ", user);
      if (!user) {
        return await res.status(401).send({
          isSuccessed: false,
          data: null,
          error: "user not found",
        });
      }
      user.fcmToken = registrationToken;
      user = await user.save();
      return await res.status(201).send({
        isSuccessed: true,
        data: user,
        error: null,
      });
    }
  },

  async removeUserToken(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      userId = auth.id,
      type = auth.type,
      user;

    if (type == "ADMIN") user = await AdminModel.findById(userId);
    else if (type == "CLIENT") user = await ClientModel.findById(userId);
    else if (type == "PROVIDER") user = await ProviderModel.findById(userId);

    if (!user) {
      return await res.status(401).send({
        isSuccessed: false,
        data: null,
        error: "user not fount",
      });
    }
    user.fcmToken = "";
    user = await user.save();
    console.log(user);
    return await res.status(201).send({
      isSuccessed: true,
      data: user,
      error: null,
    });
  },

  async getNotifications(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
      userId = auth ? auth.id : null,
      type = auth ? auth.type : "CUSTOMER";
    let notifications = await NotificationModule.getNotifications(userId, type);

    return await res.status(201).send({
      isSuccessed: true,
      data: notifications,
      error: null,
    });
  },
};
export { notificationsController };
