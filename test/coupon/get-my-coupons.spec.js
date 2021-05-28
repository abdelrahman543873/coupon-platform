import { testRequest } from "../request.js";
import { GET_MY_COUPONS } from "../endpoints/provider.js";
import {
  couponFactory,
  couponsFactory,
  providerCustomerCouponsFactory,
} from "../../src/coupon/coupon.factory.js";
import { providerFactory } from "../../src/provider/provider.factory.js";
import { HTTP_METHODS_ENUM } from "../request.methods.enum.js";
describe("get my coupons suite case", () => {
  it("get my coupons successfully", async () => {
    const provider = await providerFactory();
    await couponsFactory(10, { provider: provider._id });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_MY_COUPONS,
      token: provider.token,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.password).toBeFalsy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get recently sold coupons", async () => {
    const provider = await providerFactory();
    await providerCustomerCouponsFactory(
      10,
      { provider: provider._id },
      {},
      { provider: provider._id }
    );
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_MY_COUPONS}?recentlySold=true`,
      token: provider.token,
    });
    expect(res.body.data.docs[0].subCount).toBe(1);
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.password).toBeFalsy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get completely sold coupons", async () => {
    const provider = await providerFactory();
    const coupons = await couponsFactory(10, {
      provider: provider._id,
      amount: 0,
    });
    //checking if the filter is successfully only matching elements with amount of 0
    await couponFactory({
      amount: 5,
      provider: provider._id,
    });
    for (let i = 0; i < coupons.ops.length; i++) {
      await providerCustomerCouponsFactory(
        2,
        { provider: provider._id },
        {},
        { coupon: coupons.ops[i]._id }
      );
    }
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_MY_COUPONS}?sold=true`,
      token: provider.token,
    });
    expect(res.body.data.docs[0].subCount).toBe(2);
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.password).toBeFalsy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get unsold coupons", async () => {
    const provider = await providerFactory();
    const coupons = await couponsFactory(10, {
      provider: provider._id,
      amount: 5,
    });
    await couponFactory({
      amount: 0,
      provider: provider._id,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_MY_COUPONS}?sold=false`,
      token: provider.token,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.password).toBeFalsy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get sold coupons", async () => {
    const provider = await providerFactory();
    const coupons = await couponsFactory(10, {
      provider: provider._id,
      amount: 0,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_MY_COUPONS}?sold=true`,
      token: provider.token,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.password).toBeFalsy();
    expect(res.body.data.docs.length).toBe(10);
  });

  it("get sold coupons only and not all coupons", async () => {
    const provider = await providerFactory();
    const coupon = await couponFactory({ provider: provider._id, amount: 0 });
    const coupon1 = await couponFactory({
      provider: provider._id,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_MY_COUPONS}?sold=true`,
      token: provider.token,
    });
    expect(res.body.data.docs[0].category.enName).toBeTruthy();
    expect(res.body.data.docs[0].provider.password).toBeFalsy();
    expect(res.body.data.docs.length).toBe(1);
  });

  it("get all coupons if paramter is false", async () => {
    const provider = await providerFactory();
    const coupons = await couponsFactory(10, {
      provider: provider._id,
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${GET_MY_COUPONS}?sold=false`,
      token: provider.token,
    });
    expect(res.body.data.docs.length).toBe(10);
  });
});
