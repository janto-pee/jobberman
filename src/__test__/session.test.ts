import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { userInput } from "../utils/types";

const app = createServer();

let sessionResponse: any;
let accessResponse: string;

describe("session", () => {
  beforeAll(async () => {
    connectionScript(true);
  });

  afterAll(async () => {
    connectionScript(false);
    await prisma.$disconnect();
  });

  describe("[POST] /api/users", () => {
    it("should respond with a `201` status code for creating users", async () => {
      const { status } = await request(app)
        .post("/api/users")
        .send({
          ...userInput,
        });
      expect(status).toBe(201);
      sessionResponse = userInput;
    });
  });

  describe("/api/auth", () => {
    describe("[POST] /api/auth", () => {
      it("should respond with a `201` status code for creating sesion", async () => {
        const { status, body } = await request(app).post("/api/auth").send({
          email: userInput.email,
          hashed_password: userInput.hashed_password,
          user_agent: "xuz",
          client_ip: "bc",
        });
        console.log(status, body, userInput);
        expect(status).toBe(201);
        accessResponse = body.accessToken;
      });
    });

    describe("[GET] /api/auth", () => {
      it("should respond with a `200` status code for creating auth", async () => {
        const { status, body } = await request(app)
          .get("/api/auth")
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body.data.valid).toBe(true);
        expect(body.data.id).toBeTruthy();
      });
    });

    describe("[GET] /api/auth", () => {
      it("should respond with a `200` status code for creating auth", async () => {
        const { status, body } = await request(app)
          .put("/api/auth")
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body.data.username).toBe(sessionResponse.username);
        expect(body.data.valid).toBe(false);
      });
    });
  });
});
