import { admin } from "../admin";
import { NotificationModel } from "../model/notification";
import { AdminModel } from "../../Admin/models/admin";
import { ClientModel } from "../../Users/models/client";
import { TokensModel } from "../model/tokens";

let NotificationModule = {
  async newCouponNotification(coupon, lang, provider) {
    let tokenArray = [];
    let users = await ClientModel.find({}, { fcmToken: 1 });
    let others = await TokensModel.find();
    let admins = await AdminModel.find({}, { fcmToken: 1 });
    for (let i = 0; i < users.length; i++) {
      if (users[i].fcmToken && users[i].fcmToken != "")
        tokenArray.push(users[i].fcmToken);
    }
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].fcmToken && admins[i].fcmToken != "")
        tokenArray.push(admins[i].fcmToken);
    }
    for (let i = 0; i < others.length; i++) {
      tokenArray.push(others[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    if (tokenArray.length <= 0) return;
    let message = {
      notification: {
        title:
          lang == "en"
            ? `new Coupon from ${provider} 🥳🥳`
            : `كوبون خصم جديد من ${provider}  "🥳🥳`,
        body:
          lang == "en"
            ? "click to see the offer details"
            : "اضغط هنا للمزيد من التفاصيل",
      },
      data: {
        coupon: JSON.stringify(coupon),
      },
      android: {
        notification: {
          click_action: "view_coupon",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            category: "view_coupon",
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
      title: {
        arabic: `كوبون خصم جديد من ${provider}  "🥳🥳`,
        english: `new Coupon from ${provider} 🥳🥳`,
      },
      body: {
        english: "click to see the offer details",
        arabic: "اضغط هنا للمزيد من التفاصيل",
      },
      data: coupon,
      action: "view_coupon",
    }).save();
    return saveNotificaion;
  },

  async newProviderNotification(lang, provider) {
    let tokenArray = [];
    let admins = await AdminModel.find({}, { fcmToken: 1 });
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].fcmToken && admins[i].fcmToken != "")
        tokenArray.push(admins[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    if (tokenArray.length <= 0) return;
    let message = {
      notification: {
        title: lang == "en" ? `New Registeration` : `تسجيل جديد`,
        body:
          lang == "en"
            ? `${provider.name} has Registerd recently`
            : `${provider.name} سجل حديثا`,
      },
      data: {
        coupon: JSON.stringify(provider.id),
      },
      android: {
        notification: {
          click_action: "view_provider",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            category: "view_provider",
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
      user: "ADMIN",
      title: {
        english: `New Registeration`,
        arabic: `تسجيل جديد`,
      },
      body: {
        english: `${provider.name} has Registerd recently`,
        arabic: `${provider.name} سجل حديثا`,
      },
      data: coupon,
      action: "view_provider",
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
          if (resp.success) {
            console.log(message.tokens[idx]);
          }
          if (!resp.success) {
            console.log(resp.error);
            failedTokens.push(message.tokens[idx]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
    });
}

export { NotificationModule };
