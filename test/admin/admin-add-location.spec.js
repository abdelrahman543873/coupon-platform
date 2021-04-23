import { testRequest } from "../request.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory.js";
import { ADMIN_ADD_LOCATION } from "../endpoints/admin.js";
import { rollbackDbForAdmin } from "./rollback-for-admin.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { cityFactory } from "../../src/city/city.factory.js";
import { alexCoordinates } from "../test-coordinates.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
describe("admin add location suite case", () => {
  afterEach(async () => {
    await rollbackDbForAdmin();
  });
  it("admin add location", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATION,
      variables: {
        provider: provider._id,
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: admin.token,
    });
    expect(res.body.data.metaData[0].googlePlaceId).toBeTruthy();
    expect(res.body.data.locations.coordinates[1][0]).toBe(AlexLocation[0]);
  });

  it("should add location if inside alex", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATION,
      variables: {
        provider: provider._id,
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: admin.token,
    });
    expect(res.body.data.locations.coordinates[1][0]).toBe(AlexLocation[0]);
  });

  it("should throw error if outside alex", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [30.342228, 31.367271];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATION,
      variables: {
        provider: provider._id,
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(639);
  });

  it("only unique values added", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const params = await buildProviderParams();
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATION,
      variables: {
        provider: provider._id,
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: admin.token,
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATION,
      variables: {
        provider: provider._id,
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: admin.token,
    });
    expect(res1.body.data.locations.coordinates.length).toBe(2);
  });
});
