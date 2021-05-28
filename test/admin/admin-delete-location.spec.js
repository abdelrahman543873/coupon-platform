import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { ADMIN_DELETE_LOCATION } from "../endpoints/admin.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ProviderModel } from "../../src/provider/models/provider.model.js";
import { userFactory } from "../../src/user/user.factory.js";
import { UserRoleEnum } from "../../src/user/user-role.enum.js";
import { alexCoordinates } from "../test-coordinates.js";
describe("admin delete location suite case", () => {
  it("admin delete location successfully", async () => {
    const admin = await userFactory({ role: UserRoleEnum[2] });
    const provider = await providerFactory({
      locations: { coordinates: alexCoordinates },
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: ADMIN_DELETE_LOCATION,
      variables: {
        provider: provider._id,
        long: provider.locations.coordinates[0][0],
        lat: provider.locations.coordinates[0][1],
      },
      token: admin.token,
    });
    const providerQuery = await ProviderModel.findOne({ _id: provider._id });
    expect(providerQuery.locations.coordinates.length).toBe(2);
    expect(res.body.data).toBe(true);
  });
});
