import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UPDATE_CITY } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { buildCityParams, cityFactory } from "../../src/city/city.factory.js";
import { CityModel } from "../../src/city/model/city.model.js";
describe("update city suite case", () => {
  it("update city successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildCityParams();
    const city = await cityFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: UPDATE_CITY,
      variables: {
        ...variables,
        area: variables.area.coordinates,
        city: city._id,
      },
      token: admin.token,
    });
    expect(res.body.data.area.coordinates[0][0][0]).toBe(
      variables.area.coordinates[0][0]
    );
    expect(res.body.data.enName).toBe(variables.enName);
  });

  it("update city without location", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, area, ...variables } = await buildCityParams();
    const city = await cityFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: UPDATE_CITY,
      variables: {
        ...variables,
        city: city._id,
      },
      token: admin.token,
    });
    expect(res.body.data.enName).toBe(variables.enName);
  });
});
