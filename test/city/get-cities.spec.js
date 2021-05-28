import { GET_CITIES } from "../endpoints/city.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { citiesFactory, cityFactory } from "../../src/city/city.factory.js";
describe("add city suite case", () => {
  it("should get cities successfully with correct city center", async () => {
    await citiesFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CITIES,
    });
    expect(res.body.data.docs.length).toBeGreaterThanOrEqual(10);
  });

  it("should get correct city center", async () => {
    const city = await cityFactory({
      area: {
        coordinates: [
          [29.92308071151602, 31.19071343175268],
          [29.92297141150367, 31.190725477828938],
          [29.92300359801037, 31.190910757760925],
          [29.923113568574944, 31.190896417221833],
        ],
      },
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_CITIES}?offset=0&limit=500`,
    });
    const cityResult = res.body.data.docs.filter((cityElement) => {
      return cityElement._id === decodeURI(encodeURI(city._id));
    })[0];
    expect(cityResult.center.lat).toBe(31.1908120947568);
    expect(cityResult.center.long).toBe(29.923042490039307);
  });
});
