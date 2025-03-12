import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";
import { addressInput } from "../utils/types";

const app = createServer();

const email = randomEmail();

let addressResponse: any;

describe("/api/address", () => {
  describe("[POST] /api/address", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/address")
        .send({
          ...addressInput,
        });
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      addressResponse = body.data;
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
    it("should respond with a `200` status code and company details", async () => {
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
    it("should update with a `200` status code for updated company", async () => {
      const { status, body } = await request(app)
        .put(`/api/address/${addressResponse.id}`)
        .send({
          ...addressInput,
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
        `/api/address/${addressResponse.id}`
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
});
