import { IP } from "../../serverIP";

class Provider {
  constructor(provider) {
    if (provider) {
      this.id = provider._id;
      this.name = provider.name;
      this.email = provider.email;
      this.slogan = provider.slogan;
      this.logoURL = provider.logoURL
        ? IP + provider.logoURL
        : provider.logoURL;
      this.cities = provider.cities.map((city) => {
        return new City(city);
      });
      this.districts = provider.districts.map((dist) => {
        return new District(dist);
      });
      this.lat = provider.lat || "";
      this.lng = provider.lng || "";
      this.officeTele = provider.officeTele;
      this.websiteLink = provider.websiteLink || "";
      this.facebookLink = provider.facebookLink || "";
      this.instaLink = provider.instaLink || "";
      this.fcmToken = provider.fcmToken;
    }
  }
}

class City {
  constructor(city) {
    if (city) {
      this.id = city._id;
      this.name = city.name;
    }
  }
}

class District {
  constructor(district) {
    if (district) {
      this.id = district._id;
      this.name = district.name;
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
      this.countryCode = client.countryCode;
      this.isVerified = client.isVerified;
      this.fcmToken = client.fcmToken;
    }
  }
}

export { Provider, City, District, Category, Coupon, Client };
