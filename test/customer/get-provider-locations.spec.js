import { providerFactory } from "../../src/provider/provider.factory.js";
import { testRequest } from "../request.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
import { customerFactory } from "../../src/customer/customer.factory.js";
import { GET_PROVIDER_LOCATIONS } from "../endpoints/customer.js";
import { rollbackDbForCustomer } from "./rollback-for-customer.js";
describe("get provider locations suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("should get providers locations suite case", async () => {
    const customer = await customerFactory();
    const provider = await providerFactory({
      metaData: [
        {
          lat: 1,
          long: 1,
          enName: "alex",
          arName: "alex",
          level2longEn: "hello",
          googlePlaceId: "nice",
          level2longAr: "something",
          formattedAddressAr: "something",
          formattedAddressEn: "something",
        },
        {
          lat: 1,
          long: 1,
          enName: "alex",
          arName: "alex",
          level2longEn: "hello",
          googlePlaceId: "nice",
          level2longAr: "something",
          formattedAddressAr: "something",
          formattedAddressEn: "something",
        },
      ],
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_PROVIDER_LOCATIONS}?provider=${provider._id}`,
      token: customer.token,
    });
    expect(res.body.data[0]._id.enName).toBe('alex');
    expect(res.body.data[0]._id.arName).toBe('alex');
  });
});
