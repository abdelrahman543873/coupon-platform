import { AdminModel } from "../../Admin/models/admin.js";
import { ClientModel } from "../../Users/models/client.js";
import { TokensModel } from "../model/tokens.js";
import * as admin from "firebase-admin";
import { serviceAccount } from "../service-account-file.js";
import { NotificationModel } from "../../notification/models/notification.model.js";
let NotificationModule = {
  domain: "http://couponat.alefsoftware.com/",
  async newCouponNotification(coupon, lang, providerName) {
    let tokenArray = [];
    let users = await ClientModel.find({}, { fcmToken: 1 });
    let others = await TokensModel.find();
    let admins = await AdminModel.find({}, { fcmToken: 1 });
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].fcmToken && admins[i].fcmToken != "")
        tokenArray.push(admins[i].fcmToken);
    }
    for (let i = 0; i < users.length; i++) {
      if (users[i].fcmToken && users[i].fcmToken != "")
        tokenArray.push(users[i].fcmToken);
    }
    for (let i = 0; i < others.length; i++) {
      if (others[i].fcmToken && others[i].fcmToken != "")
        tokenArray.push(others[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    if (tokenArray.length <= 0) return;
    let message = {
      notification: {
        title: lang == "en" ? `new Coupon🥳🥳` : `كوبون خصم جديد 🥳🥳`,
        body:
          lang == "en"
            ? `new Coupon from ${providerName}  , View it `
            : `كوبون خصم جديد من ${providerName} , قم بمشاهدته`,
      },
      data: {
        id: JSON.stringify(coupon),
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
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcm_options: {
          link: this.domain + "Dashboard/coupons",
        },
      },
    };

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, message);
      newMessage.tokens = tokens;
      console.log("before: ", tokenArray);
      sendToMultiple(newMessage);
    }
    let saveNotificaion = await NotificationModel({
      user: "ALL",
      title: {
        english: `new Coupon🥳🥳`,
        arabic: `كوبون خصم جديد 🥳🥳`,
      },
      body: {
        english: `new Coupon from ${providerName}  , View it `,
        arabic: `كوبون خصم جديد من ${providerName} , قم بمشاهدته`,
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
            ? `the Provider ${provider.name} has Registerd newly`
            : `قام ${provider.name} بالتسجيل كمقدم خدمة`,
      },
      data: {
        id: JSON.stringify(provider.id),
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
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcm_options: {
          link: this.domain + "Dashboard/service-provider/view/" + provider.id,
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
        english: `the Provider ${provider.name} has Registerd newly`,
        arabic: `قام ${provider.name} بالتسجيل كمقدم خدمة`,
      },
      data: provider.id,
      action: "view_provider",
    }).save();
    return saveNotificaion;
  },

  async newSubscriptionNotification(lang, provider, couponName, subscription) {
    let tokenArray = [provider.fcmToken];
    let admins = await AdminModel.find({}, { fcmToken: 1 });
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].fcmToken && admins[i].fcmToken != "")
        tokenArray.push(admins[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    if (tokenArray.length <= 0) return;
    let message = {
      notification: {
        title: lang == "en" ? `New Purchase` : `عملية شراء جديدة`,
        body:
          lang == "en"
            ? `Coupon ${couponName.english} has been Purchased newly`
            : `الكوبون ${couponName.arabic} تم شراءه حديثا`,
      },
      data: {
        id: JSON.stringify(subscription),
      },
      android: {
        notification: {
          click_action: "view_subscription",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            category: "view_subscription",
            sound: "default",
            badge: 1,
          },
        },
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcm_options: {
          link: this.domain + "Dashboard/subscriptions/" + subscription,
        },
      },
    };

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, message);
      newMessage.tokens = tokens;
      sendToMultiple(newMessage);
    }
    let saveAdmenNotificaion = await NotificationModel({
      user: "ADMIN",
      title: {
        english: `New Purchase`,
        arabic: `عملية شراء جديدة`,
      },
      body: {
        english: `Coupon ${couponName.english} has been Purchased newly`,
        arabic: `الكوبون ${couponName.arabic} تم شراءه حديثا`,
      },
      data: subscription,
      action: "view_subscription",
    }).save();

    let saveProviderNotificaion = await NotificationModel({
      user: provider.id,
      title: {
        english: `New Purchase`,
        arabic: `عملية شراء جديدة`,
      },
      body: {
        english: `Coupon ${couponName.english} has been Purchased newly`,
        arabic: `الكوبون ${couponName.arabic} تم شراءه حديثا`,
      },
      data: subscription,
      action: "view_subscription",
    }).save();
  },

  async bankTransferNotification(lang, subscription) {
    let tokenArray = [];
    let admins = await AdminModel.find({}, { fcmToken: 1 });
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].fcmToken && admins[i].fcmToken != "")
        tokenArray.push(admins[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    let message = {
      notification: {
        title:
          lang == "en"
            ? `New Bank Transfer Operation`
            : `عملية تحويل بنكي جديدة`,
        body:
          lang == "en"
            ? `New Payment Operation need to review`
            : `عملية دفع جديده تحتاج الى مراجعه`,
      },
      data: {
        id: JSON.stringify(subscription),
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
      },
    };

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, message);
      newMessage.tokens = tokens;
      sendToMultiple(newMessage);
    }
    let saveAdmenNotificaion = await NotificationModel({
      user: "ADMIN",
      title: {
        english: `New Bank Transfer Operation`,
        arabic: `عملية تحويل بكي جديدة`,
      },
      body: {
        english: `New Payment Operation need to review`,
        arabic: `عملية دفع جديده تحتاج الى مراجعه`,
      },
      data: subscription,
      action: "view_subscription",
    }).save();
  },

  async confirmNotification(lang, client, subscription) {
    let tokenArray = [client.fcmToken];
    tokenArray = Array.from(new Set(tokenArray));
    if (tokenArray.length <= 0) return;
    let message = {
      notification: {
        title: lang == "en" ? `Subscription Tracking` : `الاشتراكات`,
        body:
          lang == "en"
            ? subscription.decision
              ? `your payment has been approved`
              : `your payment has been refused, contatct to admin`
            : subscription.decision
            ? `تم قبول عملية التحويل البنكي`
            : `تم رفض عملية التحويل البنكي برجاء التواصل مع الادمن`,
      },
      data: {
        id: JSON.stringify(subscription.id),
      },
      android: {
        notification: {
          click_action: "view_subscription",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            category: "view_subscription",
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
      user: client.id,
      title: {
        english: `Subscription Tracking`,
        arabic: `الاشتراكات`,
      },
      body: {
        english: subscription.decision
          ? `your payment has been approved`
          : `your payment has been refused, contatct to admin`,
        arabic: subscription.decision
          ? `تم قبول عملية التحويل البنكي`
          : `تم رفض عملية التحويل البنكي برجاء التواصل مع الادمن`,
      },
      data: subscription.id,
      action: "view_subscription",
    }).save();
  },

  async couponUsedNotification(lang, client, couponName, subscription) {
    let tokenArray = [client.fcmToken];
    let admins = await AdminModel.find({}, { fcmToken: 1 });
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].fcmToken && admins[i].fcmToken != "")
        tokenArray.push(admins[i].fcmToken);
    }
    tokenArray = Array.from(new Set(tokenArray));
    if (tokenArray.length <= 0) return;
    let message = {
      notification: {
        title: lang == "en" ? `Subscription Tracking` : `الاشتراكات`,
        body:
          lang == "en"
            ? `Coupon ${couponName.english} has been used`
            : `الكوبون ${couponName.arabic} تم استخدامه حديثا`,
      },
      data: {
        id: JSON.stringify(subscription),
      },
      android: {
        notification: {
          click_action: "coupon_used",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            category: "coupon_used",
            sound: "default",
            badge: 1,
          },
        },
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
      },
    };

    for (let i = 0; i < tokenArray.length; i += 500) {
      let tokens = tokenArray.slice(i, i + 499);
      let newMessage = Object.assign({}, message);
      newMessage.tokens = tokens;
      sendToMultiple(newMessage);
    }
    let saveAdmenNotificaion = await NotificationModel({
      user: "ADMIN",
      title: {
        english: `Subscription Tracking`,
        arabic: `الاشتراكات`,
      },
      body: {
        english: `Coupon ${couponName.english} has been used`,
        arabic: `تم إستخدام الكوبون ${couponName.arabic}`,
      },
      data: subscription,
      action: "coupon_used",
    }).save();

    let saveClientNotificaion = await NotificationModel({
      user: client.id,
      title: {
        english: `Subscription Tracking`,
        arabic: `الاشتراكات`,
      },
      body: {
        english: `Coupon ${couponName.english} has been used`,
        arabic: `تم إستخدام الكوبون ${couponName.arabic}`,
      },
      data: subscription,
      action: "coupon_used",
    }).save();
  },

  async getNotifications(userId, type, skip = null) {
    console.log(type, "--", userId);
    if (type && type == "CLIENT")
      return await NotificationModel.find({ user: { $in: [userId, "ALL"] } })
        .sort("-createdAt")
        .limit(10);
    else if (type && type == "ADMIN")
      return await NotificationModel.find({ user: { $in: ["ADMIN", "ALL"] } })
        .sort("-createdAt")
        .limit(10)
        .skip(skip);
    else
      return await NotificationModel.find({ user: userId })
        .sort("-createdAt")
        .limit(10);
  },
};

function sendToMultiple(message) {
  console.log("fromSend: ", message.tokens);
  admin
    .initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://coupouns-1f184.firebaseio.com",
    })
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
