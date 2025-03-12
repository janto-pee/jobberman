import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";
import { metadataInput } from "../utils/types";

const app = createServer();

let metadataResponse: any;

describe("/api/metadata", () => {
  describe("[POST] /api/metadata", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/metadata")
        .send({
          ...metadataInput,
        });
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
        `/api/metadata/${metadataResponse.id}`
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
      const { status, body } = await request(app).delete(
        `/api/metadata/${metadataResponse.id}`
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
});
