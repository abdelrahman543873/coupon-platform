import { GET_CITIES } from "../endpoints/city.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { citiesFactory, cityFactory } from "../../src/city/city.factory.js";
import { rollbackDbForCity } from "../city/rollback-for-city.js";
describe("add city suite case", () => {
  afterEach(async () => {
    await rollbackDbForCity();
  });
  it("get cities successfully", async () => {
    await citiesFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_CITIES,
    });
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get correct center for city", async () => {
    await cityFactory({
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
      url: GET_CITIES,
    });
    expect(res.body.data.docs[0].center.lat).toBe(31.1908120947568);
    expect(res.body.data.docs[0].center.long).toBe(29.923042490039307);
  });
});
