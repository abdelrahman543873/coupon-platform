import { couponFactory } from "../../src/coupon/coupon.factory";
import { customerFactory } from "../../src/customer/customer.factory";
import { CustomerModel } from "../../src/customer/models/customer.model";
import { ADD_FAV_COUPON } from "../endpoints/customer";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";
import { rollbackDbForCustomer } from "./rollback-for-customer";

describe("add fav coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForCustomer();
  });
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

  it("remove fav coupon successfully", async () => {
    const customer = await customerFactory();
    const coupon = await couponFactory();
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: ADD_FAV_COUPON,
      variables: { coupon: coupon._id },
      token: customer.token,
    });

    const favCoupons = (await CustomerModel.findOne({ _id: customer._id }))
      .favCoupons;
    expect(favCoupons.length).toBe(1);
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
