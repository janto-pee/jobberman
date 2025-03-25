import request from "supertest";
import { createServer } from "../utils/createServer";
import { connectionScript, prisma } from "../scripts";
import { metadataInput, userInput } from "../utils/types";

const app = createServer();

let sessionResponse: any;
let accessResponse: string;
let metadataResponse: any;

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
      accessResponse = body.accessToken;
    });
  });

  describe("/api/metadata", () => {
    describe("[POST] /api/metadata", () => {
      it("should respond with a `201` status code", async () => {
        const { status, body } = await request(app)
          .post("/api/metadata")
          .send({
            ...metadataInput,
          })
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(201);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        metadataResponse = body.data;
      });
    });

    describe("[GET] /api/metadata", () => {
      it("should respond with a `200` status code for all companies", async () => {
        const { status, body } = await request(app).get("/api/metadata");
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("total");
        expect(body).toHaveProperty("page");
        // expect(body).toHaveProperty("metadata");
      });
    });

    describe("[GET] /api/metadata/:id", () => {
      it("should respond with a `200` status code and company details", async () => {
        const { status, body } = await request(app).get(
          `/api/metadata/${metadataResponse.id}`,
        );

        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        //   expect(body).toHaveProperty("metadata");
      });
    });

    describe("[PUT] /api/metadata/:id", () => {
      it("should update with a `200` status code for updated company", async () => {
        const { status, body } = await request(app)
          .put(`/api/metadata/${metadataResponse.id}`)
          .set("Authorization", `Bearer ${accessResponse}`)
          .send({
            ...metadataInput,
          });
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      });
    });

    describe("[DELETE] /api/", () => {
      it("should respond with a `200` status code for deleted company", async () => {
        const { status, body } = await request(app)
          .delete(`/api/metadata/${metadataResponse.id}`)
          .set("Authorization", `Bearer ${accessResponse}`);
        expect(status).toBe(200);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      });
    });
  });
});
