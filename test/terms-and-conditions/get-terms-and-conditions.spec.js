import { get } from "../request.js";
import { TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions.js";
describe("terms and conditions suite case", () => {
  it("terms and conditions", async () => {
    const res = await get({
      url: TERMS_AND_CONDITIONS,
    });
    expect(res.body.isSuccessed).toBe(true);
  });
});
