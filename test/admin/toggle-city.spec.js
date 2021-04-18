import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { TOGGLE_CITY } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { buildCityParams, cityFactory } from "../../src/city/city.factory.js";
import { CityModel } from "../../src/city/model/city.model.js";
describe("toggle city suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("toggle city successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const city = await cityFactory();
    await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_CITY,
      variables: {
        city: city._id,
      },
      token: admin.token,
    });
    const cityActivity = (await CityModel.findOne({ _id: city._id })).isActive;
    expect(cityActivity).toBe(false);
    await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_CITY,
      variables: {
        city: city._id,
      },
      token: admin.token,
    });
    const cityActivity1 = (await CityModel.findOne({ _id: city._id })).isActive;
    expect(cityActivity1).toBe(true);
  });
});
