import { post } from "../request.js";
import { REGISTER } from "../endpoints/provider.js";
import faker from "faker";
describe("register suite case", () => {
  it("register", async () => {
    const res = await post({
      url: REGISTER,
      variables: {
        name: "abdo",
        email: faker.internet.exampleEmail(),
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
    });
    expect(res.body.data.user.name).toBe("abdo");
  });
});
