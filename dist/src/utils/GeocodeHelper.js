import NodeGeocoder from "node-geocoder";
const optionsEn = {
  provider: "google",
  httpAdapter: "https",
  // Default
  apiKey: "AIzaSyDXuT4CGvD2Ei7HRFqmL4Tj5TGUTZEPCaQ",
  // for Mapquest, OpenCage, Google Premier
  formatter: "json" // 'gpx', 'string', ...

};
const optionsAr = {
  provider: "google",
  httpAdapter: "https",
  // Default
  apiKey: "AIzaSyDXuT4CGvD2Ei7HRFqmL4Tj5TGUTZEPCaQ",
  // for Mapquest, OpenCage, Google Premier
  formatter: "json",
  // 'gpx', 'string', ...
  language: "ar"
};
const geocoderEn = NodeGeocoder(optionsEn);
const geocoderAr = NodeGeocoder(optionsAr);
let GeoInfoEn = {
  async reverseLocation(lat, lon) {
    let location = await geocoderEn.reverse({
      lat,
      lon
    }).then(doc => {
      return {
        formattedAddress: doc[0].formattedAddress ? doc[0].formattedAddress : "",
        googlePlaceId: doc[0].extra.googlePlaceId ? doc[0].extra.googlePlaceId : "",
        level2long: doc[0].administrativeLevels.level3long ? doc[0].administrativeLevels.level3long : doc[0].administrativeLevels.level2long ? doc[0].administrativeLevels.level2long : ""
      };
    }).catch(err => {
      return {
        err: err
      };
    });
    return location;
  }

};
let GeoInfoAr = {
  async reverseLocation(lat, lon) {
    let location = await geocoderAr.reverse({
      lat,
      lon
    }).then(doc => {
      return {
        formattedAddress: doc[0].formattedAddress ? doc[0].formattedAddress : "",
        googlePlaceId: doc[0].extra.googlePlaceId ? doc[0].extra.googlePlaceId : "",
        level2long: doc[0].administrativeLevels.level3long ? doc[0].administrativeLevels.level3long : doc[0].administrativeLevels.level2long ? doc[0].administrativeLevels.level2long : ""
      };
    }).catch(err => {
      return {
        err: err
      };
    });
    return location;
  }

};
export { GeoInfoAr, GeoInfoEn };