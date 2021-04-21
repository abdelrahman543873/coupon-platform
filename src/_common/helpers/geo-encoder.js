import NodeGeocoder from "node-geocoder";

const optionsEn = {
  provider: "google",
  httpAdapter: "https", // Default
  apiKey: "AIzaSyDXuT4CGvD2Ei7HRFqmL4Tj5TGUTZEPCaQ", // for Mapquest, OpenCage, Google Premier
  formatter: "json", // 'gpx', 'string', ...
};

const optionsAr = {
  provider: "google",
  httpAdapter: "https", // Default
  apiKey: "AIzaSyDXuT4CGvD2Ei7HRFqmL4Tj5TGUTZEPCaQ", // for Mapquest, OpenCage, Google Premier
  formatter: "json", // 'gpx', 'string', ...
  language: "ar",
};

const geoEncodeEn = NodeGeocoder(optionsEn);
const geoEncodeAr = NodeGeocoder(optionsAr);

export const formattedGeo = async ({ lat, lon }) => {
  const geoInfoAr = await geoEncodeAr.reverse({
    lat,
    lon,
  });
  const geoInfoEn = await geoEncodeEn.reverse({
    lat,
    lon,
  });
  return {
    formattedAddressAr: geoInfoAr[0].formattedAddress,
    formattedAddressEn: geoInfoEn[0].formattedAddress,
    level2longAr: geoInfoAr[0].administrativeLevels.level2long,
    level2longEn: geoInfoEn[0].administrativeLevels.level2long,
    googlePlaceId:
      geoInfoAr[0].extra.googlePlaceId || geoInfoEn[0].extra.googlePlaceId,
  };
};
