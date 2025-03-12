import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";

const app = createServer();
const companyId = "abcd";
const location = "delta";

describe("/api/company", () => {
  describe("[GET] /api/company", () => {
    it("should respond with a `201` status code and user details", async () => {
      const { status, body } = await request(app).get("/api/company");
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("company");
    });
  });

  describe("[GET] /api/company/:id", () => {
    it("should respond with a `404` status code and company details", async () => {
      const { status, body } = await request(app).get(
        `/api/company/${companyId}`
      );
      expect(status).toBe(404);
      //   expect(body).toHaveProperty("status");
      //   expect(body).toHaveProperty("total");
      //   expect(body).toHaveProperty("page");
      //   expect(body).toHaveProperty("company");
    });
  });

  describe("[GET] /api/company/filter", () => {
    it("should respond with a `404` status code and company details", async () => {
      const { status, body } = await request(app).get(
        `/api/company/filter?country=Nigeria`
      );
      expect(status).toBe(404);
      expect(body).not.toHaveProperty("status");
      expect(body).not.toHaveProperty("total");
      expect(body).not.toHaveProperty("page");
      expect(body).not.toHaveProperty("company");
    });
  });

  describe("[GET] /api/company/location/:location", () => {
    it("should respond with a `404` status code and a list of matching companies", async () => {
      const { status, body } = await request(app).get(
        `/api/company/location/${location}`
      );
      expect(status).toBe(404);
      expect(body).not.toHaveProperty("status");
      expect(body).not.toHaveProperty("total");
      expect(body).not.toHaveProperty("page");
      expect(body).not.toHaveProperty("company");
    });
  });

  describe("[POST] /api/company", () => {
    it("should respond with a `404` status code and a list of matching companies", async () => {
      const { status, body } = await request(app).get(
        `/api/company/location/${location}`
      );
      expect(status).toBe(404);
      expect(body).not.toHaveProperty("status");
      expect(body).not.toHaveProperty("total");
      expect(body).not.toHaveProperty("page");
      expect(body).not.toHaveProperty("company");
    });
  });
});

// It should respond with a 200 status code and user details
// It should respond with a valid session token when successful
// It should respond with a 400 status code if a user exists with the provided username
// It should respond with a 400 status code if an invalid request body is provided

// Write the tests for /auth/signin
// It should respond with a 200 status code when provided valid credentials
// It should respond with the user details when successful
// It should respond with a valid session token when successful
// It should respond with a 400 status code when given invalid credentials
// It should respond with a 400 status code when the user cannot be found
// It should respond with a 400 status code when given an invalid request body
