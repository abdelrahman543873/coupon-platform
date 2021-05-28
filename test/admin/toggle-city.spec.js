import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { TOGGLE_CITY } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { cityFactory } from "../../src/city/city.factory.js";
import { CityModel } from "../../src/city/model/city.model.js";
describe("toggle city suite case", () => {
  it("toggle city successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const city = await cityFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_CITY,
      variables: {
        city: city._id,
      },
      token: admin.token,
    });
    expect(res.body.data.isActive).toBe(false);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: TOGGLE_CITY,
      variables: {
        city: city._id,
      },
      token: admin.token,
    });
    expect(res1.body.data.isActive).toBe(true);
  });
});
