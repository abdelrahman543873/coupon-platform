import { ProviderModel } from "../../Users/models/provider.js";
import { ClientModel } from "../../Users/models/client.js";
import { AdminModel } from "../../Admin/models/admin.js";
import { NotificationModule } from "../module/notification.js";
import { decodeToken } from "../../utils/JWTHelper.js";
import { TokensModel } from "../model/tokens.js";
let notificationsController = {
  async addTokenToUser(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
        userId = auth ? auth.id : "",
        type = auth ? auth.type : "";
    let registrationToken = req.body.fcmToken,
        user;

    if (!auth) {
      let addToken = await TokensModel({
        fcmToken: registrationToken
      }).save();
      return await res.status(201).send({
        isSuccessed: true,
        data: addToken,
        error: null
      });
    } else {
      if (type == "ADMIN") user = await AdminModel.findById(userId);else if (type == "CLIENT") user = await ClientModel.findById(userId);else if (type == "PROVIDER") user = await ProviderModel.findById(userId);

      if (!user) {
        return await res.status(401).send({
          isSuccessed: false,
          data: null,
          error: "user not found"
        });
      }

      user.fcmToken = registrationToken;
      user = await user.save();
      return await res.status(201).send({
        isSuccessed: true,
        data: user,
        error: null
      });
    }
  },

  async removeUserToken(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
        userId = auth.id,
        type = auth.type,
        user;
    if (type == "ADMIN") user = await AdminModel.findById(userId);else if (type == "CLIENT") user = await ClientModel.findById(userId);else if (type == "PROVIDER") user = await ProviderModel.findById(userId);

    if (!user) {
      return await res.status(401).send({
        isSuccessed: false,
        data: null,
        error: "user not fount"
      });
    }

    user.fcmToken = "";
    user = await user.save();
    console.log(user);
    return await res.status(201).send({
      isSuccessed: true,
      data: user,
      error: null
    });
  },

  async getNotifications(req, res, next) {
    let auth = await decodeToken(req.headers.authentication),
        userId = auth ? auth.id : "",
        type = auth ? auth.type : "CLIENT",
        skip = parseInt(req.query.skip) || null;
    console.log(auth);
    let notifications = await NotificationModule.getNotifications(userId, type, skip);
    return await res.status(201).send({
      isSuccessed: true,
      data: notifications,
      error: null
    });
  }

};
export { notificationsController };