import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";
import { addressInput, sessionInput, userInput } from "../utils/types";

const app = createServer();

const email = randomEmail();

let addressResponse: any;
let userResponse: any;

let accessToken: string;

describe("/api/address", () => {
  describe("[POST] /api/users", () => {
    it("should respond with a `201` status code for creating users", async () => {
      const { status, body } = await request(app)
        .post("/api/users")
        .send({
          ...userInput,
        });
      expect(status).toBe(201);
      addressResponse = body.data.address;
      userResponse = body.data;
    });
  });
  describe("[POST] /api/sesion", () => {
    it("should respond with a `201` status code for creating session", async () => {
      const { status, body } = await request(app).post("/api/auth").send({
        email: "a1email@email.com",
        hashed_password: "abcd1234",
      });
      expect(status).toBe(200);
      accessToken = body.accessToken;
    });
  });

  describe("[POST] /api/address", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/address")
        .send({
          ...addressInput,
        })
        .set("Authorization", `Bearer ${accessToken}`);
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });

  describe("[GET] /api/address", () => {
    it("should respond with a `200` status code for all companies", async () => {
      const { status, body } = await request(app).get("/api/address");
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      // expect(body).toHaveProperty("address");
    });
  });

  describe("[GET] /api/address/:id", () => {
    it("should respond with a `200` status code and address details", async () => {
      const { status, body } = await request(app).get(
        `/api/address/${addressResponse.id}`
      );

      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("address");
    });
  });

  describe("[PUT] /api/address/:id", () => {
    it("should update with a `200` status code for updated address", async () => {
      const { status, body } = await request(app)
        .put(`/api/address/${addressResponse.id}`)
        .send({
          ...addressInput,
        })
        .set("Authorization", `Bearer ${accessToken}`);
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });

  describe("[DELETE] /api/", () => {
    it("should respond with a `200` status code for deleted address", async () => {
      const { status, body } = await request(app)
        .delete(`/api/address/${addressResponse.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      console.log(body);
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
});
