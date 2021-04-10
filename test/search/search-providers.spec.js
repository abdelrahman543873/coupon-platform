import { couponFactory } from "../../src/coupon/coupon.factory";
import { UserRoleEnum } from "../../src/user/user-role.enum";
import { userFactory } from "../../src/user/user.factory";
import { rollbackDbForCoupon } from "../coupon/rollback-for-coupon";
import { SEARCH_PROVIDERS } from "../endpoints/search";
import { testRequest } from "../request";
import { HTTP_METHODS_ENUM } from "../request.methods.enum";

describe("add coupon suite case", () => {
  afterEach(async () => {
    await rollbackDbForCoupon();
  });

  it("should search for exact word ", async () => {
    const provider = await userFactory({ role: UserRoleEnum[0] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=${provider.name}`,
    });
    expect(res.body.data.docs[0].name).toBe(provider.name);
  });

  it("should search for a letter ", async () => {
    const provider = await userFactory({ role: UserRoleEnum[0] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=${provider.name[0]}`,
    });
    expect(res.body.data.docs[0].name).toBe(provider.name);
  });

  it("shouldn't return if string is empty", async () => {
    const provider = await userFactory({ role: UserRoleEnum[0] });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=`,
    });
    expect(res.body.statusCode).toBe(620);
  });

  it("shouldn't return if string doesn't match", async () => {
    const provider = await userFactory({
      name: "something",
    });
    const res = await testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: `${SEARCH_PROVIDERS}?name=hello`,
    });
    expect(res.body.data.docs.length).toBe(0);
  });
});
