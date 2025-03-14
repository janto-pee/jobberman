import request from "supertest";
import { createServer } from "../utils/createServer";
import { hppInput } from "../utils/types";

const app = createServer();

let hppResponse: any;

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
        `/api/hpp/${hppResponse.id}`,
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
        `/api/hpp/${hppResponse.id}`,
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
});
