import { testRequest } from "../request.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { DELETE_LOCATION } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { ProviderModel } from "../../src/provider/models/provider.model.js";
import { alexCoordinates } from "../test-coordinates.js";
describe("delete location suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("delete location successfully", async () => {
    const provider = await providerFactory({
      locations: { coordinates: alexCoordinates },
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: DELETE_LOCATION,
      variables: {
        long: provider.locations.coordinates[0][0],
        lat: provider.locations.coordinates[0][1],
      },
      token: provider.token,
    });
    const providerQuery = await ProviderModel.findOne({ _id: provider._id });
    expect(providerQuery.locations.coordinates.length).toBe(2);
    expect(res.body.data).toBe(true);
  });

  it("should throw error if last location", async () => {
    const provider = await providerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: DELETE_LOCATION,
      variables: {
        long: provider.locations.coordinates[0][0],
        lat: provider.locations.coordinates[0][1],
      },
      token: provider.token,
    });
    expect(res.body.statusCode).toBe(653);
  });
});
