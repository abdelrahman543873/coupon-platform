import { get } from "../request.js";
import { REGISTER } from "../endpoints/provider.js";
import { generateToken } from "../../src/utils/JWTHelper.js";
describe("register suite case", () => {
  it("register", async () => {
    const res = await get({
      url: REGISTER,
      variables: {
        name: "abdo",
        email: "abdo@gmail.com",
        password: "123456789",
        slogan: "hala bala bala",
        cities: [
          {
            id: "5ff70597eff3770032f1393e",
            locations: [
              { lat: "31.097100200408285", long: "29.741868446680048" },
            ],
          },
        ],
        officeTele: "12345678sssasssasad",
      },
      // token: generateToken(),
    });
    console.log(res.body);
  });
});
