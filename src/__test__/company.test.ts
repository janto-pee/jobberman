import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";

const app = createServer();

const companyId = "44bb9904-a359-4a0d-9dc3-12cbc9c360c4";
const location = "delta";
const email = randomEmail();

const companyInput = {
  name: randomOwner,
  email: email,
  website: randomString(7),
  size: randomString(4),
  street: randomString(4),
  country: randomString(4),
};

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
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("company");
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
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app).post("/api/company").send({
        name: "companyname",
        email: "email10@email.com",
        website: "website",
        size: "30",
        street: "street",
        country: "nigeria",
      });
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });

  //   describe("[PUT] /api/company/:id", () => {
  //     it("should update with a `201` status code", async () => {
  //       const { status, body } = await request(app)
  //         .put("localhost:1337/api/company/44bb9904-a359-4a0d-9dc3-12cbc9c360c4")
  //         .send({
  //           name: "companyname",
  //           website: "website",
  //           size: "30",
  //         });
  //       expect(status).toBe(201);
  //       expect(body).toHaveProperty("status");
  //       expect(body).toHaveProperty("message");
  //       expect(body).toHaveProperty("data");
  //     });
  //   });

  //   describe("[DELETE] /api/", () => {
  //     it("should respond with a `201` status code", async () => {
  //       const { status, body } = await request(app)
  //         .post("localhost:1337/api/company/44bb9904-a359-4a0d-9dc3-12cbc9c360c4")
  //         .send({
  //           name: "companyname",
  //           email: "email7@email.com",
  //           website: "website",
  //           size: "30",
  //         });
  //       expect(status).toBe(200);
  //     });
  //   });
});
