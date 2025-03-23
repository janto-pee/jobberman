import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { hppInput, metadataInput, userInput } from "../utils/types";

const app = createServer();

let sessionResponse: any;
let accessResponse: string;
let hppResponse: any;

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
      const { status, body } = await request(app)
        .post("/api/users")
        .send({
          ...userInput,
        });
      expect(status).toBe(201);
      expect(body.status).toBe(true);
      expect(body.message).toBeTruthy();
      expect(body.data.id).toBeTruthy();
      expect(body.data.first_name).toBe(userInput.first_name);
      expect(body.data.last_name).toBe(userInput.last_name);
      expect(body.data.is_email_verified).toBe(false);
      expect(body.data.address.id).toBeTruthy();
      expect(body.data.address.street).toBe(userInput.street);
      expect(body.data.address.country).toBe(userInput.country);
      sessionResponse = userInput;
    });
  });

  describe("[POST] /api/auth", () => {
    it("should respond with a `201` status code for creating sesion", async () => {
      const { status, body } = await request(app).post("/api/auth").send({
        email: userInput.email,
        hashed_password: userInput.hashed_password,
        user_agent: "xuz",
        client_ip: "bc",
      });
      expect(status).toBe(201);
      expect(body.session.is_blocked).toBe(false);
      expect(body.session.valid).toBe(true);
      expect(body.session.createdAt).toBeTruthy();
      expect(body.accessToken).toBeDefined;
      accessResponse = body.accessToken;
    });
  });

  describe("/api/hpp", () => {
    describe("/api/hpp", () => {
      describe("[POST] /api/hpp", () => {
        it("should respond with a `201` status code", async () => {
          const { status, body } = await request(app)
            .post("/api/hpp")
            .send({
              ...hppInput,
            });
          expect(status).toBe(201);
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("message");
          expect(body).toHaveProperty("data");
          hppResponse = body.data;
        });
      });

      describe("[GET] /api/hpp", () => {
        it("should respond with a `201` status code for all companies", async () => {
          const { status, body } = await request(app).get("/api/hpp");
          expect(status).toBe(200);
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("total");
          expect(body).toHaveProperty("page");
          //   expect(body).toHaveProperty("hpp");
        });
      });

      describe("[GET] /api/hpp/:id", () => {
        it("should respond with a `200` status code and company details", async () => {
          const { status, body } = await request(app).get(
            `/api/hpp/${hppResponse.id}`
          );

          expect(status).toBe(200);
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("message");
          //   expect(body).toHaveProperty("company");
        });
      });

      describe("[PUT] /api/hpp/:id", () => {
        it("should update with a `201` status code for updated company", async () => {
          const { status, body } = await request(app)
            .put(`/api/hpp/${hppResponse.id}`)
            .send({
              ...hppInput,
            });
          expect(status).toBe(200);
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("message");
          expect(body).toHaveProperty("data");
        });
      });

      describe("[DELETE] /api/", () => {
        it("should respond with a `200` status code for deleted company", async () => {
          const { status, body } = await request(app).delete(
            `/api/hpp/${hppResponse.id}`
          );
          expect(status).toBe(200);
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("message");
          expect(body).toHaveProperty("data");
        });
      });
    });
  });
});
