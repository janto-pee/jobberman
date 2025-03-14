import request from "supertest";
import { createServer } from "../utils/createServer";
import { fgsInput } from "../utils/types";

const app = createServer();

let fgsResponse: any;

describe("/api/fgs", () => {
  describe("[POST] /api/fgs", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/fgs")
        .send({
          ...fgsInput,
        });
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      fgsResponse = body.data;
    });
  });

  describe("[GET] /api/fgs", () => {
    it("should respond with a `201` status code for all companies", async () => {
      const { status, body } = await request(app).get("/api/fgs");
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      //   expect(body).toHaveProperty("fgs");
    });
  });

  describe("[GET] /api/fgs/:id", () => {
    it("should respond with a `200` status code and company details", async () => {
      const { status, body } = await request(app).get(
        `/api/fgs/${fgsResponse.id}`,
      );

      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      //   expect(body).toHaveProperty("company");
    });
  });

  describe("[PUT] /api/fgs/:id", () => {
    it("should update with a `201` status code for updated company", async () => {
      const { status, body } = await request(app)
        .put(`/api/fgs/${fgsResponse.id}`)
        .send({
          ...fgsInput,
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
        `/api/fgs/${fgsResponse.id}`,
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
});
