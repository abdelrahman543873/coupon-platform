class Provider {
  constructor(provider) {
    this.id = provider._id;
    this.name = provider.name;
    this.email = provider.email;
    this.slogan = provider.slogan;
    this.logoURL = provider.logoURL;
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

class City {
  constructor(city) {
    this.id = city._id;
    this.name = city.name;
  }
}

class District {
  constructor(district) {
    this.id = district._id;
    this.name = district.name;
  }
}

class Category {
  constructor(category) {
    console.log(category);
    this.id = category._id;
    this.name = category.name;
    this.images = category.images;
  }
}

class Coupon {
  constructor(coupon) {
    this.id = coupon._id;
    this.name = coupon.name;
    this.description = coupon.description;
    this.provider = new Provider(coupon.provider);
    this.servicePrice = coupon.servicePrice;
    this.offerPrice = coupon.offerPrice;
    this.totalCount = coupon.totalCount;
    this.category = new Category(coupon.category);
    this.code = coupon.code;
    this.imgURL = coupon.imgURL;
    this.qrURL = coupon.qrURL;
  }
}

export { Provider, City, District, Category, Coupon };
