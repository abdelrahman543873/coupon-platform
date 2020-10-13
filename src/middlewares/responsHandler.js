class Provider {
  constructor(provider) {
    this.name = provider.name;
    this.email = provider.email;
    this.slogan = provider.slogan;
    this.cities = provider.cities;
    this.districts = provider.districts;
    this.lat = provider.lat;
    this.lng = provider.lng;
    this.officeTele = provider.officeTele;
    this.websiteLink = provider.websiteLink;
    this.facebookLink = provider.facebookLink;
    this.instaLink = provider.instaLink;
    this.fcmToken = provider.fcmToken;
  }
}

class City{
    constructor(city){
        this.name=city.name;
    }
}

export { Provider,City};
