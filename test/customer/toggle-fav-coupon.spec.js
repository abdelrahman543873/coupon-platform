import { couponFactory } from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { CustomerModel } from "../../src/customer/models/customer.model";
import { ADD_FAV_COUPON, GET_FAV_COUPONS } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("add fav coupon suite case", () => {
  it("add fav coupon successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    const favCoupons = (await CustomerModel.findOne({ _id: customer._id }))
      .favCoupons;
    expect(favCoupons.length).toBe(2);
  });

  it("add fav coupon successfully where fav coupons are empty", async () => {
    const customer = await customerFactory({ favCoupons: [null] });
    const coupon = await couponFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    const favCoupons = (await CustomerModel.findOne({ _id: customer._id }))
      .favCoupons;
    expect(favCoupons.length).toBe(1);
  });

  it("remove fav coupon successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    const coupons = (await CustomerModel.findOne({ _id: customer._id }))
      .favCoupons;
    expect(coupons.length).toBe(2);
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_FAV_COUPONS,
      token: customer.token,
    });
    expect(res.body.data.length).toBe(2);
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });

    const favCoupons = (await CustomerModel.findOne({ _id: customer._id }))
      .favCoupons;
    expect(favCoupons.length).toBe(1);
    const res1 = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: GET_FAV_COUPONS,
      token: customer.token,
    });
    expect(res1.body.data.length).toBe(1);
  });

  it("error if fav coupon null", async () => {
    const customer = await customerFactory();
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: null },
      token: customer.token,
    });
    expect(res.body.statusCode).toBe(400);
  });
});
