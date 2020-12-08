import { IP } from "../../serverIP";
import { paymentRouter } from "../Purchasing/routes/route/paymentType";

class Provider {
  constructor(provider) {
    if (provider) {
      this.id = provider._id;
      this.name = provider.name;
      this.email = provider.email;
      this.slogan = provider.slogan;
      this.logoURL = provider.logoURL ? IP + provider.logoURL : "";
      this.cities = provider.cities.map((city) => {
        return new City(city);
      });
      this.location = provider.location;
      this.officeTele = provider.officeTele;
      this.websiteLink = provider.websiteLink || "";
      this.facebookLink = provider.facebookLink || "";
      this.instaLink = provider.instaLink || "";
      this.twittwerLink = provider.twittwerLink || "";
      this.fcmToken = provider.fcmToken;
      this.isActive = provider.isActive;
    }
  }
}

class City {
  constructor(city) {
    if (city) {
      this.id = city._id;
      this.name = city.name;
      this.location = city.location;
    }
  }
}

class Category {
  constructor(category) {
    if (category) {
      this.id = category._id ? category._id : null;
      this.name = category.name;
      this.images = {
        selected: IP + category.images.selected,
        unSelected: IP + category.images.unSelected,
      };
    }
  }
}

class Coupon {
  constructor(coupon) {
    if (coupon) {
      this.id = coupon._id;
      this.name = coupon.name;
      this.description = coupon.description;
      this.provider = new Provider(coupon.provider);
      this.servicePrice = coupon.servicePrice;
      this.offerPrice = coupon.offerPrice;
      this.totalCount = coupon.totalCount;
      this.subCount = coupon.subCount;
      this.category = new Category(coupon.category);
      this.code = coupon.code;
      this.imgURL = IP + coupon.imgURL;
      this.qrURL = IP + coupon.qrURL;
    }
  }
}

class Client {
  constructor(client) {
    if (client) {
      this.id = client._id;
      this.name = client.name;
      this.mobile = client.mobile;
      this.email = client.email;
      this.countryCode = client.countryCode;
      this.isVerified = client.isVerified;
      this.fcmToken = client.fcmToken;
      this.isSocialMediaVerified = client.isSocialMediaVerified;
      this.imgURL = client.imgURL
        ? client.isSocialMediaVerified
          ? client.imgURL
          : IP + client.imgURL
        : "";
    }
  }
}

class Bank {
  constructor(bank) {
    if (bank) {
      this.id = bank._id;
      this.accountNumber = bank.accountNumber;
      this.bankName = bank.bankName;
      this.agentName = bank.agentName;
      this.city = bank.city;
      this.country = bank.country;
      this.isActive = bank.isActive;
      bank.swiftCode ? (this.swiftCode = bank.swiftCode) : "";
    }
  }
}

class Payment {
  constructor(payment) {
    if (payment) {
      this.id = payment._id;
      this.name = payment.name;
      this.key = payment.key;
      this.isActive = payment.isActive;
    }
  }
}

class Cridit {
  constructor(cridit) {
    if (cridit) {
      this.id = cridit._id;
      this.merchantEmail = cridit.merchantEmail;
      this.secretKey = cridit.secretKey;
    }
  }
}

class Subscription {
  constructor(subscription, type) {
    if (subscription) {
      this.id = subscription._id;
      type != "CLIENT" ? (this.user = new Client(subscription.user)) : "";
      this.paymentType = new Payment(subscription.paymentType);
      this.coupon = new Coupon(subscription.coupon);
      this.code = subscription.code;
      this.isConfirmed = subscription.isConfirmed;
      this.isUsed = subscription.isUsed;
      this.isPaid = subscription.isPaid;
      this.total = subscription.total;
      this.transactionId = subscription.transactionId;
      subscription.account
        ? (this.account =
            subscription.paymentType.key == "ONLINE_PAYMENT"
              ? new Cridit(subscription.account)
              : new Bank(subscription.account))
        : "";
      this.qrURL = IP + subscription.qrURL;
      this.subDate = subscription.createdAt;
      subscription.imgURL ? (this.imgURL = IP + subscription.imgURL) : "";
      subscription.note ? (this.note = subscription.note) : "";
    }
  }
}

export {
  Provider,
  City,
  Category,
  Coupon,
  Client,
  Bank,
  Payment,
  Cridit,
  Subscription,
};
