import { customerFactory } from "../../src/customer/customer.factory";
import { buildUserParams } from "../../src/user/user.factory";
import { CHANGE_PHONE, UPDATE_CUSTOMER } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";
describe("change phone suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
  it("should change phone and sent otp successfully", async () => {
    const params = await buildUserParams();
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: CHANGE_PHONE,
      variables: { phone: params.phone },
      token: customer.token,
    });
    expect(res.body.data.user.password).toBeFalsy();
    expect(res.body.data.user._id).toBe(decodeURI(encodeURI(customer.user)));
    expect(res.body.data.user.favCoupons).toBeTruthy();
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.PUT,
      url: UPDATE_CUSTOMER,
      variables: { phone: params.phone, code: "12345" },
      token: customer.token,
    });
    expect(res.body.data.user.password).toBeFalsy();
    expect(res.body.data.user._id).toBe(decodeURI(encodeURI(customer.user)));
    expect(res.body.data.user.favCoupons).toBeTruthy();
    expect(res1.body.data.user.phone).toBe(params.phone);
  });
});
