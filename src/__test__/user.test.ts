// import request from "supertest";
import request from "supertest";
import { createServer } from "../utils/createServer";
import { addressInput, userInput } from "../utils/types";
import { connectionScript, prisma } from "../scripts";

const app = createServer();

let userResponse: any;
let accessToken: string;

describe("user", () => {
  beforeEach(async () => {
    connectionScript(true);
  });

  afterEach(async () => {
    connectionScript(false);
    await prisma.$disconnect();
  });

  describe("/api/user", () => {
    describe("[POST] /api/users", () => {
      it("should respond with a `201` status code for creating users", async () => {
        const { status, body } = await request(app)
          .post("/api/users")
          .send({
            ...userInput,
          });
        expect(status).toBe(201);
        userResponse = body.data.user;
      });
    });

    // describe("[GET] /api/users/verify/:id/:verificationcode", () => {
    //   it("should respond with a `201` status code for creating session", async () => {
    //     const { status, body } = await request(app)
    //       .post(`/api/users/verify/:id/:verificationcode`)
    //       .send({
    //         email: "a1email@email.com",
    //         hashed_password: "abcd1234",
    //       });
    //     expect(status).toBe(200);
    //     accessToken = body.accessToken;
    //   });
    // });

    // describe("[POST] /api/users/forgot-password", () => {
    //   it("should respond with a `201` status code", async () => {
    //     const { status, body } = await request(app)
    //       .post("/api/user")
    //       .send({
    //         ...addressInput,
    //       })
    //       .set("Authorization", `Bearer ${accessToken}`);
    //     expect(status).toBe(201);
    //     expect(body).toHaveProperty("status");
    //     expect(body).toHaveProperty("message");
    //     expect(body).toHaveProperty("data");
    //   });
    // });

    // describe("[PUT] /api/users/passwordreset/:id/:passwordresetcode", () => {
    //   it("should respond with a `200` status code for all companies", async () => {
    //     const { status, body } = await request(app).get("/api/user");
    //     expect(status).toBe(200);
    //     expect(body).toHaveProperty("status");
    //     expect(body).toHaveProperty("total");
    //     expect(body).toHaveProperty("page");
    //     // expect(body).toHaveProperty("address");
    //   });
    // });

    // describe("[GET] /api/user/me", () => {
    //   it("should respond with a `200` status code and address details", async () => {
    //     const { status, body } = await request(app).get(
    //       `/api/user/${userResponse.id}`
    //     );

    //     expect(status).toBe(200);
    //     expect(body).toHaveProperty("status");
    //     expect(body).toHaveProperty("message");
    //     expect(body).toHaveProperty("address");
    //   });
    // });
  });
});
