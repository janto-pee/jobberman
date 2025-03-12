import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";
import { tbsInput } from "../utils/types";

const app = createServer();

const email = randomEmail();

let tbsResponse: any;

describe("/api/tbs", () => {
  describe("[POST] /api/tbs", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/tbs")
        .send({
          ...tbsInput,
        });
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      tbsResponse = body.data;
    });
  });

  describe("[GET] /api/tbs/:id", () => {
    it("should respond with a `200` status code and company details", async () => {
      const { status, body } = await request(app).get(
        `/api/tbs/${tbsResponse.id}`
      );

      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("company");
    });
  });

  describe("[PUT] /api/tbs/:id", () => {
    it("should update with a `201` status code for updated company", async () => {
      const { status, body } = await request(app)
        .put(`/api/tbs/${tbsResponse.id}`)
        .send({
          name: "companyname",
          website: "website",
          size: "30",
        });
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
  describe("[DELETE] /api/", () => {
    it("should respond with a `200` status code for deleted company", async () => {
      const { status, body } = await request(app).delete(
        `/api/tbs/${tbsResponse.id}`
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });
});
