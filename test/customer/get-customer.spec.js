import { customerFactory } from "../../src/customer/customer.factory";
import { CUSTOMER_REGISTER } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("customer register suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("customer register", async () => {
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: CUSTOMER_REGISTER,
      token: customer.token,
    });
    expect(res.body.data.socialMediaId).toBe(customer.socialMediaId);
  });
});
