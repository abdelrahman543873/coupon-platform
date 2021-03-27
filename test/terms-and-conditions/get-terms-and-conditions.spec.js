import { get } from "../request";
import { TERMS_AND_CONDITIONS } from "../endpoints/terms-and-conditions";
describe("terms and conditions suite case", () => {
  it("terms and conditions", async () => {
    const res = await get({
      url: TERMS_AND_CONDITIONS,
    });
    console.log(res.body);
  });
});
