import request = require("supertest");
import { randomEmail, randomOwner, randomString } from "../utils/random";
import { createServer } from "../utils/createServer";

const app = createServer();

let companyResponse: {
  id: string;
  name: string;
  email: string;
  website: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  addressId: string;
};

const email = randomEmail();

const companyInput = {
  name: randomOwner(),
  email: email,
  website: randomString(7),
  size: randomString(4),
  street: randomString(4),
  country: "nigeria",
};
let addressResponse: {
  id: string;
  street: string;
  street2: string;
  city: string;
  state_province_code: string;
  state_province_name: string;
  postal_code: string;
  country_code: string;
  latitude: string;
  longitude: string;
  country: string;
};
describe("/api/company", () => {
  describe("[POST] /api/company", () => {
    it("should respond with a `201` status code", async () => {
      const { status, body } = await request(app)
        .post("/api/company")
        .send({
          ...companyInput,
        });
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      companyResponse = body.data;
      addressResponse = body.data.address;
    });
  });

  describe("[GET] /api/company", () => {
    it("should respond with a `201` status code for all companies", async () => {
      const { status, body } = await request(app).get("/api/company");
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("company");
    });
  });

  describe("[GET] /api/company/:id", () => {
    it("should respond with a `200` status code and company details", async () => {
      const { status, body } = await request(app).get(
        `/api/company/${companyResponse.id}`
      );

      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("company");
    });
  });

  describe("[GET] /api/company/filter", () => {
    it("should respond with a `200` status code and company filter", async () => {
      const { status, body } = await request(app).get(
        `/api/search/company/filter?city=oyo`
      );
      expect(status).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("page");
      // expect(body).toHaveProperty("company");
    });
  });

  describe("[GET] /api/company/location/:location", () => {
    it("should respond with a `404` status code and a list of matching companies", async () => {
      const { status, body } = await request(app).get(
        `/api/company/location/oyo`
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("company");
    });
  });

  describe("[PUT] /api/company/:id", () => {
    it("should update with a `201` status code for updated company", async () => {
      const { status, body } = await request(app)
        .put(`/api/company/${companyResponse.id}/${addressResponse.id}`)
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
        `/api/company/${companyResponse.id}`
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    });
  });

  describe("[DELETE] /api/address", () => {
    it("should respond with a `200` status code for deleted address", async () => {
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
