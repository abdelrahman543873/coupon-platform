import { testRequest } from "../request.js";
import {
  buildProviderParams,
  providerFactory,
} from "../../src/provider/provider.factory.js";
import { ADD_LOCATION, DELETE_LOCATION } from "../endpoints/provider.js";
import { rollbackDbForProvider } from "./rollback-for-provider.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { cityFactory } from "../../src/city/city.factory.js";
import { alexCoordinates } from "../test-coordinates.js";
describe("add location suite case", () => {
  afterEach(async () => {
    await rollbackDbForProvider();
  });
  it("add location", async () => {
    const provider = await providerFactory({
      password: "something",
    });
    await buildProviderParams();
    await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res.body.data.locations.coordinates[1][0]).toBe(AlexLocation[0]);
  });

  it("add location and delete location", async () => {
    const provider = await providerFactory({
      password: "something",
    });
    await buildProviderParams();
    await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res.body.data.locations.coordinates[1][0]).toBe(AlexLocation[0]);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.DELETE,
      url: DELETE_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res1.body.data).toBe(true);
  });

  it("should add location if inside alex", async () => {
    const provider = await providerFactory({ password: "something" });
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res.body.data.locations.coordinates[1][0]).toBe(AlexLocation[0]);
  });

  it("should add slightly modified locations", async () => {
    const provider = await providerFactory({
      password: "something",
      locations: {},
      metaData: [],
    });
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res.body.data.locations.coordinates[0][0]).toBe(AlexLocation[0]);
    const AlexLocationModified = [29.90911858954698, 31.20164350982159];
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocationModified[0],
        lat: AlexLocationModified[1],
      },
      token: provider.token,
    });
    expect(res1.body.data.metaData.length).toBe(2);
  });

  it("should throw error if outside alex", async () => {
    const provider = await providerFactory({ password: "something" });
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [30.342228, 31.367271];
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res.body.statusCode).toBe(639);
  });

  it("only unique values added", async () => {
    const provider = await providerFactory({ locations: {}, metaData: [] });
    const params = await buildProviderParams();
    const city = await cityFactory({
      enName: "alex",
      arName: "Alexandria",
      area: { coordinates: alexCoordinates },
    });
    const AlexLocation = [29.909118589546985, 31.201643509821597];
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });

    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_LOCATION,
      variables: {
        long: AlexLocation[0],
        lat: AlexLocation[1],
      },
      token: provider.token,
    });
    expect(res.body.data.locations.coordinates.length).toBe(1);
    expect(res.body.data.metaData.length).toBe(1);
  });
});
