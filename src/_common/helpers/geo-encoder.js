import NodeGeocoder from "node-geocoder";
import dotenv from "dotenv";

dotenv.config();
const optionsEn = {
  provider: "google",
  httpAdapter: "https", // Default
  apiKey: process.env.GOOGLE_API, // for Mapquest, OpenCage, Google Premier
  formatter: "json", // 'gpx', 'string', ...
};

const optionsAr = {
  provider: "google",
  httpAdapter: "https", // Default
  apiKey: process.env.GOOGLE_API, // for Mapquest, OpenCage, Google Premier
  formatter: "json", // 'gpx', 'string', ...
  language: "ar",
};

const geoEncodeEn = NodeGeocoder(optionsEn);
const geoEncodeAr = NodeGeocoder(optionsAr);

export const formattedGeo = async ({ lat, lon, enName, arName, center }) => {
  const geoInfoAr = await geoEncodeAr.reverse({
    lat,
    lon,
  });
  const geoInfoEn = await geoEncodeEn.reverse({
    lat,
    lon,
  });
  return {
    lat,
    center,
    enName,
    arName,
    long: lon,
    googlePlaceId: geoInfoEn[0].extra.googlePlaceId,
    formattedAddressAr: geoInfoAr[0].formattedAddress,
    formattedAddressEn: geoInfoEn[0].formattedAddress,
    level2longAr: geoInfoAr[0].administrativeLevels.level2long,
    level2longEn: geoInfoEn[0].administrativeLevels.level2long,
  };
};
