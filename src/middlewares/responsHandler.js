class Provider {
  constructor(provider) {
    console.log(provider);
    //provider=
    // provider=provider.populate('cities').populate('districts').execPopulate();
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

export { Provider, City, District };
