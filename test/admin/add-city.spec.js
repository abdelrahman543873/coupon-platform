import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { userFactory } from "../../src/user/user.factory.js";
import { ADD_CITY } from "../endpoints/admin.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { buildPaymentParams } from "../../src/payment/payment.factory.js";
import { buildCityParams } from "../../src/city/city.factory.js";
describe("add city suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("add city type successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildCityParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CITY,
      variables: { ...variables, area: variables.area.coordinates },
      token: admin.token,
    });
    expect(res.body.data.area.coordinates).toBeTruthy();
  });

  it("should through error if two point are the same", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildCityParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CITY,
      variables: {
        ...variables,
        area: [...variables.area.coordinates, variables.area.coordinates[0]],
      },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("should through error if less than three points are inserted", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildCityParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CITY,
      variables: {
        ...variables,
        area: [variables.area.coordinates[0]],
      },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(400);
  });

  it("should through error if longitude inserted instead of latitude", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const { isActive, ...variables } = await buildCityParams();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_CITY,
      variables: {
        ...variables,
        area: [...variables.area.coordinates, [-182, -92]],
      },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(400);
  });
});
