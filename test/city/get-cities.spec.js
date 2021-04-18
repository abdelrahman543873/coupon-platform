import { GET_CITIES } from "../endpoints/city.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { citiesFactory } from "../../src/city/city.factory.js";
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
});
