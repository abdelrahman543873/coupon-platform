// import boom from "@hapi/boom";
// import { ProviderModel } from "../../ProviderManagement/models/provider";
// import { ClientModel } from "../../CustomersManagement/models/client";
// import { AdminModel } from "../../Admin&PlatformSpec/models/admin";
// import { NotificationModule } from "../module/notification";
// import { decodeTokenAndGetType } from "../../utils/JWTHelper";
// import { TokensModel } from "../model/tokens";

let notificationsController = {
  // async addTokenToUser(req, res, next) {
  //   let userId = req.params.id,
  //     registrationToken = req.body.fcmToken,
  //     type = req.body.type,
  //     user;
  //   if (userId == "ANY") {
  //     let addToken = await TokensModel({ fcmToken: registrationToken }).save();
  //     return await res.status(201).send({
  //       isSuccessed: true,
  //       data: addToken,
  //       error: null,
  //     });
  //   } else {
  //     if (type == "ADMIN") user = await AdminModel.findById(userId);
  //     else if (type == "CLIENT") user = await ClientModel.findById(userId);
  //     else if (type == "PROVIDER") user = await ProviderModel.findById(userId);
  //     console.log("userId : ", userId);
  //     console.log("type : ", type);
  //     console.log("users : ", user);
  //     if (!user) {
  //       return await res.status(401).send({
  //         isSuccessed: false,
  //         data: null,
  //         error: "user not fount",
  //       });
  //     }
  //     user.fcmToken = registrationToken;
  //     user = await user.save();
  //     return await res.status(201).send({
  //       isSuccessed: true,
  //       data: user,
  //       error: null,
  //     });
  //   }
  // },

  // async removeUserToken(req, res, next) {
  //   let userId = req.params.id,
  //     type = req.body.type,
  //     user;

  //   if (type == "ADMIN") user = await AdminModel.findById(userId);
  //   else if (type == "CLIENT") user = await ClientModel.findById(userId);
  //   else if (type == "PROVIDER") user = await ProviderModel.findById(userId);

  //   if (!user) {
  //     return next("not found");
  //   }
  //   user.fcmToken = "";
  //   user = await user.save();
  //   console.log(user);
  //   return await res.status(201).send({
  //     isSuccessed: true,
  //     data: user,
  //     error: null,
  //   });
  // },

  // async getNotifications(req, res, next) {
  //   let auth = req.headers.authentication;
  //   //console.log(auth);
  //   let decodeAuth = decodeTokenAndGetType(auth);
  //   if (!decodeAuth) {
  //     let lang = req.headers.lang || "ar";
  //     let errMsg = lang == "en" ? "Wrong Authentication!" : "خطأ بالتوثيق";
  //     return next(boom.unauthorized(errMsg));
  //   }
  //   let userId = req.params.id;
  //   let type = decodeAuth.type || null;
  //   let notifications = await NotificationModule.getNotifications(userId, type);

  //   return await res.status(201).send({
  //     isSuccessed: true,
  //     data: notifications,
  //     error: null,
  //   });
  // },
};
export { notificationsController };
