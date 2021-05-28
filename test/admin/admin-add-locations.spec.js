import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { ADMIN_ADD_LOCATIONS } from "../endpoints/admin.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { cityFactory } from "../../src/city/city.factory.js";
import { alexCoordinates } from "../test-coordinates.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
describe("admin add location suite case", () => {
  it("admin add locations", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory({ locations: {}, metaData: [] });
    await cityFactory({
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const AlexLocation1 = [29.909118589, 31.2016435098];
    const AlexLocation2 = [29.9091185895469, 31.201643509821];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATIONS,
      variables: {
        provider: provider._id,
        locations: [AlexLocation, AlexLocation1, AlexLocation2],
      },
      token: admin.token,
    });
    expect(res.body.data.metaData[0].enName).toBeTruthy();
    expect(res.body.data.metaData[0].arName).toBeTruthy();
    expect(res.body.data.metaData[0].center).toBeTruthy();
    expect(res.body.data.metaData.length).toBe(3);
    expect(res.body.data.locations.coordinates.length).toBe(3);
  });

  it("should throw error if outside alex", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    const city = await cityFactory({
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [30.342228, 31.367271];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATIONS,
      variables: {
        provider: provider._id,
        locations: [AlexLocation],
      },
      token: admin.token,
    });
    expect(res.body.statusCode).toBe(639);
  });

  it("only unique values added", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory();
    await cityFactory({
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATIONS,
      variables: {
        provider: provider._id,
        locations: [AlexLocation],
      },
      token: admin.token,
    });
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADMIN_ADD_LOCATIONS,
      variables: {
        provider: provider._id,
        locations: [AlexLocation],
      },
      token: admin.token,
    });
    expect(res1.body.data.locations.coordinates.length).toBe(2);
  });
});
