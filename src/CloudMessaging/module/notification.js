import { admin } from "../admin";
import { NotificationModel } from "../model/notification";
import { AdminModel } from "../../Admin&PlatformSpec/models/admin";
import { ClientModel } from "../../CustomersManagement/models/client";
import { ProviderModel } from "../../ProviderManagement/models/provider";
import { TokensModel } from "../model/tokens";
import { BazarModule } from "../../ProviderManagement/modules/bazar";

let NotificationModule = {
  async sendChatNotification(message) {
    let to,
      from,
      tokenArray = [];
    console.log(message.to.type);
    if (message.to.type == "ADMIN") {
      to = await AdminModel.findById(message.to.id);
      tokenArray.push(to.fcmToken);
    } else if (message.to.type == "CLIENT") {
      to = await ClientModel.findById(message.to.id);
      tokenArray.push(to.fcmToken);
    } else if (message.to.type == "PROVIDER") {
      //to = await ProviderModel.findById(message.to.id);
      tokenArray = await BazarModule.getFcmTokens(
        message.to.id,
        "BAZAR_CUSTOMER_SERVICE"
      );
    }
    console.log("arr: ",tokenArray)
    if (!to) return;

    if (message.from.type == "ADMIN")
      from = await AdminModel.findById(message.from.id);
    else if (message.from.type == "CLIENT")
      from = await ClientModel.findById(message.from.id);
    else if (message.from.type == "PROVIDER")
      from = await ProviderModel.findById(message.from.id);
    console.log("from--", message.from);

    console.log("tokeeen: ", tokens);
    let messageNotification = {
      notification: {
        title:
          (message.lang == "en" ? "Message from " : "رسالة من ") +
          from.username,
        body: message.type != "img" ? message.text : "",
      },
      data: {
        channelId: message.channelId.toString(),
      },
      //token: to.fcmToken,

      android: {
        notification: {
          click_action: "Join",
          sound: "default",
          image: message.type == "img" ? message.text : "",
        },
      },

      apns: {
        payload: {
          aps: {
            category: "Join",
            sound: "default",
            badge: 1,
          },
        },
        fcm_options: {
          image: message.type == "img" ? message.text : "",
        },
      },
    };

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, messageNotification);
      newMessage.tokens = tokens;
      sendToMultiple(newMessage);
    }
  },

  async sendOrderNotification(registrationToken, message) {
    console.log("data: ", message.data);
    let messageNotification = {
      notification: {
        title: message.lang == "ar" ? message.titleAr : message.titleEn,
        body: message.lang == "ar" ? message.bodyAr : message.bodyEn,
      },
      data: {
        order: message.data.toString(),
      },
      token: registrationToken,

      android: {
        notification: {
          click_action: message.action,
          sound: "default",
        },
      },

      apns: {
        payload: {
          aps: {
            category: message.action,
            sound: "default",
            badge: 1,
          },
        },
      },
    };
    return await admin
      .messaging()
      .send(messageNotification)
      .then(async () => {
        delete message.lang;
        let saveNotificaion = await NotificationModel({ ...message }).save();
        return saveNotificaion;
      })
      .catch((err) => {
        return err;
      });
  },

  async sendBazarOrderNotification(tokenArray, message) {
    console.log("data: ", message.data);
    let messageNotification = {
      notification: {
        title: message.lang == "ar" ? message.titleAr : message.titleEn,
        body: message.lang == "ar" ? message.bodyAr : message.bodyEn,
      },
      data: {
        order: message.data.toString(),
      },
      android: {
        notification: {
          click_action: message.action,
          sound: "default",
        },
      },

      apns: {
        payload: {
          aps: {
            category: message.action,
            sound: "default",
            badge: 1,
          },
        },
      },
    };
    // return await admin
    //   .messaging()
    //   .send(messageNotification)
    //   .then(async () => {
    //     delete message.lang;
    //     let saveNotificaion = await NotificationModel({ ...message }).save();
    //     return saveNotificaion;
    //   })
    //   .catch((err) => {
    //     return err;
    //   });

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, messageNotification);
      newMessage.tokens = tokens;
      sendToMultiple(newMessage);
    }
    let saveNotificaion = await NotificationModel({ ...message }).save();
    return saveNotificaion;
  },

  async offerNotification(offer, lang, bazarName) {
    let tokenArray = [];
    let users = await ClientModel.find();
    let others = await TokensModel.find();
    for (let i = 0; i < users.length; i++) {
      if (users[i].fcmToken && users[i].fcmToken != "")
        tokenArray.push(users[i].fcmToken);
    }
    for (let i = 0; i < others.length; i++) {
      tokenArray.push(others[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    let message = {
      notification: {
        title:
          lang == "en"
            ? `new offer from ${bazarName} 🥳🥳`
            : "عرض جديد من " + bazarName + "🥳🥳",
        body:
          lang == "en"
            ? "click to see the offer details"
            : "اضغط هنا للمزيد من التفاصيل",
      },
      data: {
        offer: JSON.stringify(offer),
      },
      android: {
        notification: {
          click_action: "view_offer",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            category: "view_offer",
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, message);
      newMessage.tokens = tokens;
      sendToMultiple(newMessage);
    }
    let saveNotificaion = await NotificationModel({
      user: "ALL",
      titleEn: `new offer from ${bazarName} 🥳🥳`,
      titleAr: "عرض جديد من " + bazarName + "🥳🥳",
      bodyEn: "click to see the offer details",
      bodyAr: "اضغط هنا للمزيد من التفاصيل",
      data: offer,
      action: "view_offer",
    }).save();
    return saveNotificaion;
  },

  async getNotifications(userId, type) {
    console.log(type, "--", userId);
    if (type && type == "CUSTOMER")
      return await NotificationModel.find({ user: { $in: [userId, "ALL"] } })
        .sort("-createdAt")
        .limit(10);
    else
      return await NotificationModel.find({ user: userId })
        .sort("-createdAt")
        .limit(10);
  },
};
function sendToMultiple(message) {
  admin
    .messaging()
    .sendMulticast(message)
    .then((response) => {
      console.log(response);
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
    });
}

export { NotificationModule };
